import { NextResponse } from 'next/server';
import { checkUserStateServer, getStampFromDbByStampId, increaseStampCountToDb, verifyClaimStamp } from '~/lib/services/stamps';
import type { VerifyClaimStampResponse, VerifyStampParams, DbStampResponse, StampItem, VerifyClaimStampRequest } from '~/types/stamp';
import { getStampsFromDb } from '~/lib/services/stamps';
import { suiClient, graphqlClient } from '../SuiClient';
import { unstable_cache } from 'next/cache';

const getCachedStams = unstable_cache(
    async () => getStampsFromDb(),
    ['stamps-list'],  // cache tag
    { revalidate: 30 }  // 30 seconds
);


export async function POST(request: Request) {
    try {
        const requestBody: VerifyClaimStampRequest = await request.json() as VerifyClaimStampRequest;
        if (!requestBody.address || !requestBody.packageId || !requestBody.stamp_id || !requestBody.claim_code || !requestBody.passport_id || !requestBody.last_time || !requestBody.stamp_name) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters' },
                { status: 400 }
            );
        }
        //todo check if the stamp is claimable
        const stamp = await getStampFromDbByStampId(requestBody.stamp_id);
        const now = Date.now()
        const startTime = stamp?.claim_code_start_timestamp ? Number(stamp.claim_code_start_timestamp) : null
        const endTime = stamp?.claim_code_end_timestamp ? Number(stamp.claim_code_end_timestamp) : null
        if (startTime && endTime && (now < startTime || now > endTime)) {
            return NextResponse.json(
                { success: false, error: 'Stamp is not claimable' },
                { status: 200 }
            );
        }
        if (stamp?.total_count_limit && stamp.claim_count >= stamp.total_count_limit) {
            return NextResponse.json(
                { success: false, error: 'Stamp is sold out' },
                { status: 200 }
            );
        }
        const profile = await checkUserStateServer(requestBody.address, requestBody.packageId, suiClient, graphqlClient);
        if (profile?.stamps?.some((stamp: StampItem) => stamp.event === requestBody.stamp_name)) {
            return NextResponse.json(
                { success: false, error: 'You have already claimed this stamp' },
                { status: 200 }
            );
        }

        const { isValid, signature } = await verifyClaimStamp({ stamp_id: requestBody.stamp_id, claim_code: requestBody.claim_code, passport_id: requestBody.passport_id, last_time: requestBody.last_time } satisfies VerifyStampParams);

        const response: VerifyClaimStampResponse = {
            success: true,
            valid: isValid,
            signature
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Verification failed'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const stamps: DbStampResponse[] | undefined = await getCachedStams();
        if(stamps?.length === 0) {
            const stamps = await getStampsFromDb();
            return new NextResponse(JSON.stringify(stamps), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
                },
            });
        }
        return new NextResponse(JSON.stringify(stamps), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('Error fetching claim stamps:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to fetch claim stamps' },
            { status: 500 }
        );
    }
}


export async function PATCH(request: Request) {
    try {
        const { stamp_id } = await request.json();
        const result = await increaseStampCountToDb(stamp_id as string);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to increase stamp count' }, { status: 500 });
    }
}
