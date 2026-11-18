import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("admin_token");
  if (!token || !token.value) {
    return NextResponse.json({ authenticated: false, role: null, email: null });
  }

  try {
    const decoded = Buffer.from(token.value, "base64").toString("utf-8");
    if (decoded.startsWith("{")) {
      const data = JSON.parse(decoded);
      return NextResponse.json({
        authenticated: true,
        role: data.role || "admin",
        email: data.email || "admin@assonclothing.com",
      });
    } else {
      // Legacy token format fallback
      const [email] = decoded.split(":");
      const isSuper = email?.toLowerCase().includes("super");
      return NextResponse.json({
        authenticated: true,
        role: isSuper ? "superadmin" : "admin",
        email: email || "admin@assonclothing.com",
      });
    }
  } catch {
    return NextResponse.json({
      authenticated: Boolean(token.value),
      role: "admin",
      email: "admin@assonclothing.com",
    });
  }
}
