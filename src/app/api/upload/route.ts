import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "looma_uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary URL or keys are configured, upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const result = await uploadToCloudinary(buffer, folder);
      return NextResponse.json({
        url: result.url,
        public_id: result.public_id,
      });
    }

    // Fallback: If in dev without Cloudinary credentials, convert to base64 Data URL
    const mimeType = file.type || "image/png";
    const base64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    return NextResponse.json({
      url: base64,
      public_id: `local_${Date.now()}`,
      note: "Development fallback (configure CLOUDINARY_URL in .env.local for production CDN storage)",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
