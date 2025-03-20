import { NextResponse } from "next/server";
import { revalidateTag, unstable_cache } from 'next/cache';
import { getUsersFromDb, createOrUpdateUser } from "~/lib/services/user";
import { createUserParams } from "~/types/userProfile";
import { checkUserStateServer } from "~/lib/services/stamps";
import { suiClient, graphqlClient } from '../SuiClient';

const getCachedUsers = unstable_cache(
    async () => getUsersFromDb(),
    ['users-list'],  // cache tag
    { revalidate: 30 }  // 30 seconds
);

export async function GET() {
    try {
        const users = await getCachedUsers();
        return new NextResponse(JSON.stringify(users), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('Error in GET /api/users:', error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedUser = createUserParams.parse(body);
        const profile = await checkUserStateServer(validatedUser.address, validatedUser.packageId, suiClient, graphqlClient);
        if (!profile) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        if(Number(profile.points) !== Number(validatedUser.points)) {
            return NextResponse.json(
                { error: "User points not match" },
                { status: 400 }
            );
        }
        if(profile.stamps?.length !== validatedUser.stamp_count) {
            return NextResponse.json(
                { error: "User stamps not match" },
                { status: 400 }
            );
        }
        const user = await createOrUpdateUser(validatedUser);
        // 使用 revalidateTag 使缓存失效
        revalidateTag('users-list');
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in POST /api/user:', error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}