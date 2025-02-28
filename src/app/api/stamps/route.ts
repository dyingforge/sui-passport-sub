import { NextResponse } from 'next/server';
import { checkUserStateServer, increaseStampCountToDb, verifyClaimStamp } from '~/lib/services/stamps';
import type { VerifyClaimStampResponse, VerifyStampParams, DbStampResponse, StampItem } from '~/types/stamp';
import { getStampsFromDb } from '~/lib/services/stamps';
import { suiClient, graphqlClient, type NetworkVariables } from '../SuiClient';

export async function POST(request: Request) {
    try {
        const {address, networkVariables, stamp_id, claim_code, passport_id, last_time, stamp_name} = await request.json();
        if (!address || !networkVariables || !stamp_id || !claim_code || !passport_id || !last_time || !stamp_name) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const profile = await checkUserStateServer(address as string, networkVariables as NetworkVariables, suiClient, graphqlClient);
        if (profile?.stamps?.some((stamp: StampItem) => stamp.event === stamp_name)) {
            return NextResponse.json(
                { success: false, error: 'You have already claimed this stamp' },
                { status: 200 }
            );
        }

        const { isValid, signature } = await verifyClaimStamp({ stamp_id, claim_code, passport_id, last_time } satisfies VerifyStampParams);

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
