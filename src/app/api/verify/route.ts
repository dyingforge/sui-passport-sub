import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const req = await request.json();
    const secret = process.env.TURNSTILE_SECRET_KEY;

    const response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            secret: secret,
            response: req.token,
        }),
    });

    const data = await response.json();
    console.log("data", data);
    if (data.success) {
        return NextResponse.json({ success: true, message: "Captcha verified" }, { status: 200 });
    } else {
        return NextResponse.json({ success: false, message: "Captcha verification failed" }, { status: 200 });
    }
}