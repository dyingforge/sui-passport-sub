import { NextResponse } from "next/server";
import { getUsersFromDb, createOrUpdateUser } from "~/lib/services/user";
import { createUserParams } from "~/types/userProfile";

export async function GET() {
    try {
        const users = await getUsersFromDb();
        return NextResponse.json(users);
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
        const user = await createOrUpdateUser(validatedUser);
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in POST /api/user:', error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}