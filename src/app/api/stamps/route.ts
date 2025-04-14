import { NextResponse } from 'next/server';
import type { VerifyClaimStampResponse, VerifyStampParams, StampItem, VerifyClaimStampRequest } from '~/types/stamp';
import { suiClient, graphqlClient } from '../SuiClient';
import { passportService, stampService } from '~/lib/db';

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
        const stamp = await stampService.getById(requestBody.stamp_id);
        const now = Math.floor(Date.now() / 1000); // 转换为秒级时间戳
        const startTime = stamp?.claim_code_start_timestamp ? Number(stamp.claim_code_start_timestamp) : null
        const endTime = stamp?.claim_code_end_timestamp ? Number(stamp.claim_code_end_timestamp) : null
        if (startTime && endTime && (now < startTime || now > endTime)) {
            return NextResponse.json(
                { success: false, error: 'Stamp is not claimable' },
                { status: 200 }
            );
        }
        if (stamp?.total_count_limit && stamp.claim_count && stamp.claim_count >= stamp.total_count_limit) {
            return NextResponse.json(
                { success: false, error: 'Stamp is sold out' },
                { status: 200 }
            );
        }
        const profile = await passportService.checkUserState(requestBody.address, requestBody.packageId, suiClient, graphqlClient);
        if (profile?.stamps?.some((stamp: StampItem) => stamp.event === requestBody.stamp_name)) {
            return NextResponse.json(
                { success: false, error: 'You have already claimed this stamp' },
                { status: 200 }
            );
        }

        const { isValid, signature } = await stampService.verify({ stamp_id: requestBody.stamp_id, claim_code: requestBody.claim_code, passport_id: requestBody.passport_id, last_time: requestBody.last_time } satisfies VerifyStampParams);

        const response: VerifyClaimStampResponse = {
            success: true,
            valid: isValid,
            signature: signature ?? undefined
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
        const result = await stampService.getAll();
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
        const result = await stampService.increaseCount(stamp_id as string);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to increase stamp count' }, { status: 500 });
    }
}
