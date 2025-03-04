import { NextResponse } from 'next/server';
import { checkUserStateServer, increaseStampCountToDb, verifyClaimStamp } from '~/lib/services/stamps';
import type { VerifyClaimStampResponse, VerifyStampParams, DbStampResponse, StampItem, VerifyClaimStampRequest } from '~/types/stamp';
import { getStampsFromDb } from '~/lib/services/stamps';
import { suiClient, graphqlClient } from '../SuiClient';

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
        const result: DbStampResponse[] | undefined = await getStampsFromDb();
        return NextResponse.json(result);
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
