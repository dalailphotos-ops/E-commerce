import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Design from "@/models/Design";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id || "";
    // Clean id: strip file extension if provided (e.g. ASSON-123.png -> ASSON-123)
    const cleanId = rawId.replace(/\.(png|jpe?g|webp)$/i, "").trim();

    await connectToDatabase();

    // Query design document by designId or MongoDB _id
    let design = await Design.findOne({ designId: cleanId });
    if (!design && cleanId.match(/^[0-9a-fA-F]{24}$/)) {
      design = await Design.findById(cleanId);
    }

    if (!design) {
      return NextResponse.redirect(new URL("/logo.png", req.url));
    }

    const preview = design.frontPreviewUrl || design.backPreviewUrl || "";

    // If preview is a base64 Data URI, decode and return as binary PNG image
    if (preview.startsWith("data:image")) {
      const matches = preview.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1] === "jpeg" ? "image/jpeg" : "image/png";
        const buffer = Buffer.from(matches[2], "base64");
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            "Content-Disposition": `inline; filename="mockup-${cleanId}.png"`,
          },
        });
      }
    }

    // If preview is a valid Cloudinary or HTTP image URL, redirect directly
    if (preview.startsWith("http://") || preview.startsWith("https://")) {
      return NextResponse.redirect(preview);
    }

    // Fallback
    return NextResponse.redirect(new URL("/logo.png", req.url));
  } catch (error: any) {
    console.error("Mockup endpoint error:", error);
    return NextResponse.redirect(new URL("/logo.png", req.url));
  }
}
