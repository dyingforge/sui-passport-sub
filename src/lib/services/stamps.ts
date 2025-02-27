import { bcs } from "@mysten/sui/bcs";
import { queryD1 } from "../dbHelper";
import type { DbStampResponse, VerifyStampParams } from "~/types/stamp";
import { fromHex } from "@mysten/sui/utils";
import { keccak256 } from "js-sha3";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { z } from 'zod';
import { cache } from 'react';

const verifyStampSchema = z.object({
  stamp_id: z.string(),
  passport_id: z.string(),
  last_time: z.number(),
  claim_code: z.string()
});

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
