import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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

    // Ensure uploads directories exist
    const baseUploadsDir = path.join(process.cwd(), "public", "uploads");
    const artworksDir = path.join(baseUploadsDir, "artworks");
    const mockupsDir = path.join(baseUploadsDir, "mockups");

    if (!fs.existsSync(artworksDir)) {
      fs.mkdirSync(artworksDir, { recursive: true });
    }
    if (!fs.existsSync(mockupsDir)) {
      fs.mkdirSync(mockupsDir, { recursive: true });
    }

    const originalName = file.name || "upload.png";
    const extMatch = originalName.match(/\.(png|jpe?g|webp|svg)$/i);
    const ext = extMatch ? extMatch[0].toLowerCase() : (file.type?.includes("jpeg") || file.type?.includes("jpg") ? ".jpg" : ".png");

    let savedFilename = "";
    let relativeUrl = "";
    let fileId = "";

    if (type === "mockup" || folder === "mockups") {
      const cleanDesignId = designId.replace(/[^a-zA-Z0-9_-]/g, "") || `LOOMA-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      fileId = cleanDesignId;
      savedFilename = `${cleanDesignId}-${side}${ext}`;
      const destPath = path.join(mockupsDir, savedFilename);
      fs.writeFileSync(destPath, buffer);

      // Also save as cleanDesignId.ext for default resolution if side is front
      const defaultDestPath = path.join(mockupsDir, `${cleanDesignId}${ext}`);
      try {
        fs.writeFileSync(defaultDestPath, buffer);
      } catch (err) {
        console.error("Failed to write default mockup path:", err);
      }

      relativeUrl = `/uploads/mockups/${savedFilename}`;
    } else {
      // Artwork upload
      const cleanBaseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40) || "artwork";
      fileId = `art_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
      savedFilename = `${fileId}_${cleanBaseName}${ext}`;
      const destPath = path.join(artworksDir, savedFilename);
      fs.writeFileSync(destPath, buffer);
      relativeUrl = `/uploads/artworks/${savedFilename}`;
    }

    // Optional Cloudinary upload in background / if configured
    let cloudinaryUrl = "";
    let cloudinaryId = "";
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(buffer, folder);
        cloudinaryUrl = result.url;
        cloudinaryId = result.public_id;
      } catch (cErr) {
        console.warn("Cloudinary upload failed, using local disk asset:", cErr);
      }
    }

    return NextResponse.json({
      url: relativeUrl,
      publicUrl: relativeUrl,
      cloudinaryUrl: cloudinaryUrl || undefined,
      filename: originalName,
      savedFilename,
      id: fileId,
      public_id: cloudinaryId || fileId,
      status: "success",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
