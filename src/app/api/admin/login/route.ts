import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedAdminEmail = process.env.ADMIN_EMAIL || "admin@assonclothing.com";
    const expectedAdminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    const expectedSuperEmail = process.env.SUPERADMIN_EMAIL || "superadmin@assonclothing.com";
    const expectedSuperPassword = process.env.SUPERADMIN_PASSWORD || "superadmin123456";

    const inputEmail = email?.trim().toLowerCase();
    const inputPass = password?.trim();

    let role: "superadmin" | "admin" | null = null;
    let authEmail = "";

    // 1. Check Superadmin first
    if (
      inputEmail === expectedSuperEmail.trim().toLowerCase() &&
      inputPass === expectedSuperPassword.trim()
    ) {
      role = "superadmin";
      authEmail = expectedSuperEmail;
    }
    // 2. Check Standard Admin
    else if (
      inputEmail === expectedAdminEmail.trim().toLowerCase() &&
      inputPass === expectedAdminPassword.trim()
    ) {
      role = "admin";
      authEmail = expectedAdminEmail;
    }

    if (role) {
      // Create session token with role information
      const payload = JSON.stringify({
        email: authEmail,
        role,
        timestamp: Date.now(),
      });
      const sessionToken = Buffer.from(payload).toString("base64");

      cookies().set("admin_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        success: true,
        role,
        email: authEmail,
        message: `Authenticated successfully as ${role}`,
      });
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
