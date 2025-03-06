import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { token } = await request.json();
    const secret = process.env.TURNSTILE_SECRET_KEY;

    const response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
        method: "POST",
        body: JSON.stringify({ token, secret }),
    });

    const data = await response.json();
    if (data.success) {
        return NextResponse.json({ success: true, message: "Captcha verified" }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, message: "Captcha verification failed" }, { status: 200 });
    }
}