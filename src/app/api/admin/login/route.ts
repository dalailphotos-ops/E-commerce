import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@assonclothing.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123456";

    if (
      email &&
      password &&
      email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password.trim() === expectedPassword.trim()
    ) {
      // Create session token
      const sessionToken = Buffer.from(
        `${expectedEmail}:${Date.now()}`
      ).toString("base64");

      cookies().set("admin_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        message: "Authenticated successfully",
      });
    }

    return NextResponse.json(
      { error: "Invalid admin email or password" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
