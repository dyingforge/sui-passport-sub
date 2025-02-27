import { NextResponse } from 'next/server';
import { increaseStampCountToDb, verifyClaimStamp } from '~/lib/services/stamps';
import type { VerifyClaimStampResponse, VerifyStampParams, DbStampResponse } from '~/types/stamp';
import { getStampsFromDb } from '~/lib/services/stamps';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.stamp_id || !body.claim_code) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const { isValid, signature } = await verifyClaimStamp(body as VerifyStampParams);

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
