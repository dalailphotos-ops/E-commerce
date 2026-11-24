import { NextRequest, NextResponse } from "next/server";
import { resolveImage } from "@/lib/image-storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  try {
    const pathSegments = params.path || [];
    const filename = pathSegments[pathSegments.length - 1] || "";

    if (!filename) {
      return NextResponse.redirect(new URL("/logo.png", req.url));
    }

    // Try resolving from image storage (memory cache, /tmp, public/uploads, MongoDB)
    const resolved = await resolveImage(filename);
    if (resolved) {
      return new NextResponse(new Uint8Array(resolved.buffer), {
        status: 200,
        headers: {
          "Content-Type": resolved.contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
          "Content-Disposition": `inline; filename="${resolved.filename}"`,
        },
      });
    }

    // If not found directly, redirect to /api/mockup/[id] for deep fallback
    const targetUrl = new URL(`/api/mockup/${filename}`, req.url);
    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.warn("Uploads proxy caught error:", err);
    return NextResponse.redirect(new URL("/logo.png", req.url));
  }
}
