import { bcs } from "@mysten/sui/bcs";
import { queryD1 } from "../dbHelper";
import type { DbStampResponse, StampItem, VerifyStampParams } from "~/types/stamp";
import { fromHex } from "@mysten/sui/utils";
import { keccak256 } from "js-sha3";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { z } from 'zod';
import { cache } from 'react';
import { type NetworkVariables } from "../contracts";
import type { UserProfile } from "~/types/userProfile";
import type { SuiClient, SuiObjectData, SuiObjectResponse } from "@mysten/sui/client";
import { getCollectionDetail } from "../contracts/graphql";
import type { SuiGraphQLClient } from "@mysten/sui/graphql";

const verifyStampSchema = z.object({
  stamp_id: z.string(),
  passport_id: z.string(),
  last_time: z.number(),
  claim_code: z.string()
});

interface ParsedContent<T = unknown> {
  type: string;
  fields: T;
}

function updateProfileFromPassport(profile: UserProfile, passportFields: Partial<UserProfile>) {
  type ValidKeys = keyof Pick<UserProfile, 'avatar' | 'collections' | 'email' | 'exhibit' |
      'github' | 'id' | 'introduction' | 'last_time' | 'name' | 'points' | 'x'>;

  (Object.keys(passportFields) as ValidKeys[]).forEach(field => {
      if (field in passportFields && field in profile) {
          (profile[field] as UserProfile[ValidKeys]) = passportFields[field] as UserProfile[ValidKeys];
      }
  });

  if (passportFields.id?.id) {
      profile.passport_id = passportFields.id.id;
  }
}

interface StampFields {
  id: { id: string };
  image_url: string;
  name: string;
  [key: string]: unknown;
}

function createStampFromFields(fields: StampFields): StampItem | null {
  try {
      return {
          ...fields,
          id: fields.id.id,
          imageUrl: fields.image_url,
          name: fields.name
      };
  } catch (error) {
      console.error('Error creating stamp:', error);
      return null;
  }
}

async function enrichProfileWithCollectionDetails(
  profile: UserProfile,
  client: SuiGraphQLClient
): Promise<void> {
  interface CollectionQueryResult {
      data?: {
          owner?: {
              dynamicFields?: {
                  nodes?: Array<{
                      name?: {
                          json: string;
                      };
                  }>;
              };
          };
      };
  }

  const collectionDetail = await client.query({
      query: getCollectionDetail,
      variables: {
          address: profile.collections.fields.id.id,
      }
  }) as CollectionQueryResult;

  profile.collection_detail =
      collectionDetail.data?.owner?.dynamicFields?.nodes
          ?.map(node => node.name?.json)
          ?.filter((item): item is string => Boolean(item)) ?? [];
}

export const getStampsFromDb = cache(async (): Promise<DbStampResponse[]|undefined> => {
    try {
      const query = `
      SELECT 
        stamp_id, 
        claim_code_start_timestamp, 
        claim_code_end_timestamp,
        total_count_limit,
        user_count_limit,
        claim_count,
        public_claim,
        CASE WHEN claim_code IS NULL THEN 0 ELSE 1 END as has_claim_code
      FROM stamps`;
      
      const response = await queryD1<DbStampResponse[]>(query);    
      return response.data;
    } catch (error) {
      console.error('Error fetching claim stamps:', error);
      throw error;
    }
  });

export async function verifyClaimStamp(params: VerifyStampParams) {
  const validatedParams = verifyStampSchema.parse(params);
  const current_timestamp = Date.now();
  const sql = `
    SELECT 
      CASE 
        WHEN claim_code = ? AND (
          (claim_code_start_timestamp IS NULL AND claim_code_end_timestamp IS NULL) OR
          (claim_code_start_timestamp IS NOT NULL AND claim_code_end_timestamp IS NULL AND claim_code_start_timestamp <= ?) OR
          (claim_code_start_timestamp IS NULL AND claim_code_end_timestamp IS NOT NULL AND claim_code_end_timestamp >= ?) OR
          (claim_code_start_timestamp IS NOT NULL AND claim_code_end_timestamp IS NOT NULL AND claim_code_start_timestamp <= ? AND claim_code_end_timestamp >= ?)
        )
        THEN 1
        ELSE 0
      END as valid
    FROM stamps 
    WHERE stamp_id = ?`;

  const result = await queryD1(sql, [
    validatedParams.claim_code,
    current_timestamp,
    current_timestamp,
    current_timestamp,
    current_timestamp,
    validatedParams.stamp_id
  ]);
  const validData = result.data as unknown as { results: [{ valid: number }] };
  const isValid = validData.results[0]?.valid === 1;

  let signature;
  if (isValid) {
    signature = await signMessage(validatedParams.passport_id, validatedParams.last_time);
  }

  return { isValid, signature };
}

function parseObjectData<T>(data: SuiObjectData): ParsedContent<T> | null {
  if (data.content?.dataType !== "moveObject") return null;
  return {
      type: data.content.type,
      fields: data.content.fields as T,
  };
}

export const checkUserStateServer = async (
  address: string,
  packageId: string,
  suiClient: SuiClient,
  graphqlClient: SuiGraphQLClient
): Promise<UserProfile | null> => {
  const profile: UserProfile = {
      avatar: "",
      collections: { fields: { id: { id: "" }, size: 0 } },
      email: "",
      exhibit: [],
      github: "",
      current_user: address,
      id: { id: "" },
      introduction: "",
      last_time: 0,
      name: "",
      admincap: "",
      points: 0,
      x: "",
      passport_id: "",
      stamps: [],
      collection_detail: [],
  };

  try {
      // 使用分页获取所有对象
      const objects = await fetchAllOwnedObjectsServer(address, packageId, suiClient);

      objects.forEach((obj) => {
          if (!obj.data) return;

          const parsed = parseObjectData(obj.data);
          if (!parsed) return;

          const { type, fields } = parsed;

          switch (type) {
              case `${packageId}::sui_passport::SuiPassport`:
                  updateProfileFromPassport(profile, fields as UserProfile);
                  break;
              case `${packageId}::stamp::AdminCap`:
                  const adminCapId = (fields as { id: { id: string } })?.id?.id;
                  if (adminCapId) profile.admincap = adminCapId;
                  break;
              case `${packageId}::stamp::Stamp`:
                  const stamp = createStampFromFields(fields as StampFields);
                  if (stamp) profile.stamps?.push(stamp);
                  break;
          }
      });

      await enrichProfileWithCollectionDetails(profile, graphqlClient);

      return profile;
  } catch (error) {
      console.error('Error in checkUserStateServer:', error);
      return null;
  }
};

async function fetchAllOwnedObjectsServer(
  address: string,
  packageId: string,
  suiClient: SuiClient
): Promise<SuiObjectResponse[]> {
  const allObjects: SuiObjectResponse[] = [];
  let hasNextPage = true;
  let nextCursor: string | null = null;

  while (hasNextPage) {
      try {
          const response = await suiClient.getOwnedObjects({
              owner: address,
              options: { showContent: true },
              filter: {
                  MatchAny: [
                      { StructType: `${packageId}::stamp::AdminCap` },
                      { StructType: `${packageId}::sui_passport::SuiPassport` },
                      { StructType: `${packageId}::stamp::Stamp` }
                  ]
              },
              cursor: nextCursor,
          });

          allObjects.push(...response.data);
          hasNextPage = response.hasNextPage;
          nextCursor = response.nextCursor ?? null;

          // 添加错误处理和重试逻辑
          if (!response.data.length && hasNextPage) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // 添加延迟避免请求过快
          }
      } catch (error) {
          console.error('Error fetching owned objects:', error);
          break; // 发生错误时中断循环
      }
  }

  return allObjects;
}

const signMessage = async (passport_id: string, last_time: number) => {
    try {
        const claim_stamp_info = bcs.struct('ClaimStampInfo', {
            passport: bcs.Address,
            last_time: bcs.u64()
        });

        const claim_stamp_info_bytes = claim_stamp_info.serialize({
            passport: passport_id, 
            last_time
        }).toBytes();
        const hash_data = keccak256(claim_stamp_info_bytes);
        const hash_bytes = fromHex(hash_data);

        if (!process.env.ADDRESS_SECRET_KEY) {
            throw new Error('STAMP_SECRET_KEY is not set');
        }
        const keypair = Ed25519Keypair.fromSecretKey(process.env.ADDRESS_SECRET_KEY);
        const signature = await keypair.sign(hash_bytes);        
        return signature;
    } catch (error) {
        console.error('Signing error:', error);
        throw error;
    }
}


export async function increaseStampCountToDb(id: string) {
  const query = `
    UPDATE stamps 
    SET claim_count = COALESCE(claim_count, 0) + 1 
    WHERE stamp_id = ? 
    RETURNING *
  `;
  return queryD1<DbStampResponse>(query, [id]);
}
