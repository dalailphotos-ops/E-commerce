import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { saveImage } from "@/lib/image-storage";
import crypto from "node:crypto";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "artwork";
    const designId = (formData.get("designId") as string) || "";
    const side = (formData.get("side") as string) || "front";
    const folder = (formData.get("folder") as string) || (type === "mockup" ? "mockups" : "artworks");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || "upload.png";
    const extMatch = originalName.match(/\.(png|jpe?g|webp|svg)$/i);
    const ext = extMatch
      ? extMatch[0].toLowerCase()
      : file.type?.includes("jpeg") || file.type?.includes("jpg")
      ? ".jpg"
      : ".png";

    const contentType =
      file.type || (ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png");

    let savedFilename = "";
    let fileId = "";

    if (type === "mockup" || folder === "mockups") {
      const cleanDesignId =
        designId.replace(/[^a-zA-Z0-9_-]/g, "") ||
        `ASSON-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      fileId = cleanDesignId;
      savedFilename = `${cleanDesignId}-${side}${ext}`;
    } else {
      const cleanBaseName =
        path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30) || "art";
      const cleanDesignPrefix = designId ? `${designId.replace(/[^a-zA-Z0-9_-]/g, "")}_` : "";
      fileId = `art_${cleanDesignPrefix}${Date.now().toString(36)}_${crypto.randomBytes(2).toString("hex")}`;
      savedFilename = `${fileId}_${cleanBaseName}${ext}`;
    }

    // Optional Cloudinary upload if user configured it
    let cloudinaryUrl = "";
    let cloudinaryId = "";
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(buffer, folder);
        cloudinaryUrl = result.url;
        cloudinaryId = result.public_id;
      } catch (cErr) {
        console.warn("Cloudinary upload notice (falling back to image storage):", cErr);
      }
    }

    // Save to memory cache, disk (/tmp or public/uploads), and MongoDB
    const saveResult = await saveImage({
      id: fileId,
      filename: savedFilename,
      buffer,
      contentType,
      type: type === "mockup" ? "mockup" : "artwork",
      designId: designId || (type === "mockup" ? fileId : undefined),
    });

    // Determine public URL
    const finalUrl = cloudinaryUrl || saveResult.url;

    return NextResponse.json({
      url: finalUrl,
      publicUrl: finalUrl,
      cloudinaryUrl: cloudinaryUrl || undefined,
      filename: originalName,
      savedFilename,
      id: fileId,
      public_id: cloudinaryId || fileId,
      status: "success",
    });
  } catch (error: any) {
    console.error("Upload error caught:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
