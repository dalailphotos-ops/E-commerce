import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Design from "@/models/Design";
import Quote from "@/models/Quote";
import { REVERSE_ENGINEERED_PRODUCTS } from "@/lib/constants";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id || "";
    // Clean id: strip file extension if provided (e.g. LOOMA-123.png -> LOOMA-123)
    const cleanId = rawId.replace(/\.(png|jpe?g|webp)$/i, "").trim();

    if (!cleanId) {
      return NextResponse.redirect(new URL("/logo.png", req.url));
    }

    // 1. Tier 1: Check local disk storage (public/uploads/mockups)
    const mockupsDir = path.join(process.cwd(), "public", "uploads", "mockups");
    const candidateFiles = [
      `${cleanId}.jpg`,
      `${cleanId}.png`,
      `${cleanId}-front.jpg`,
      `${cleanId}-front.png`,
      `${cleanId}.webp`,
      `${cleanId}-back.jpg`,
      `${cleanId}-back.png`,
    ];

    for (const filename of candidateFiles) {
      const filePath = path.join(mockupsDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          const fileBuffer = fs.readFileSync(filePath);
          const ext = path.extname(filename).toLowerCase();
          const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : "image/png";
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": mimeType,
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
              "Content-Disposition": `inline; filename="${filename}"`,
            },
          });
        } catch (err) {
          console.warn(`Error reading local mockup file ${filePath}:`, err);
        }
      }
    }

    // 2. Tier 2: Check MongoDB database
    let preview = "";
    let design: any = null;

    try {
      await connectToDatabase();

      const escapedCleanId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const idRegex = new RegExp(`^${escapedCleanId}$`, "i");

      design = await Design.findOne({
        $or: [
          { designId: cleanId },
          { designId: { $regex: idRegex } },
          ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : []),
        ],
      });

      if (design) {
        preview =
          design.previewUrl ||
          design.frontPreviewUrl ||
          design.backPreviewUrl ||
          design.artworkUrl ||
          (Array.isArray(design.uploadedAssets) && design.uploadedAssets[0]) ||
          "";
      }

      // Check Quote collection if design had no preview
      if (!preview) {
        const quote = await Quote.findOne({
          $or: [
            { "items.designPreviewUrl": { $regex: escapedCleanId, $options: "i" } },
            { notes: { $regex: escapedCleanId, $options: "i" } },
            ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : []),
          ],
        });

        if (quote && quote.items && quote.items.length > 0) {
          const matchingItem =
            quote.items.find(
              (it: any) =>
                it.designPreviewUrl &&
                it.designPreviewUrl.toLowerCase().includes(cleanId.toLowerCase())
            ) || quote.items[0];

          if (matchingItem && matchingItem.designPreviewUrl) {
            preview = matchingItem.designPreviewUrl;
          }
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB connection or query failed in mockup route:", dbErr);
    }

    // 3. If preview is a base64 Data URI, decode and return as binary PNG/JPEG image
    if (preview && preview.startsWith("data:image")) {
      const matches = preview.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const format = matches[1].toLowerCase();
        const mimeType = format.includes("jpeg") || format.includes("jpg") ? "image/jpeg" : "image/png";
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

    // 4. If preview is a local /uploads path
    if (preview && preview.startsWith("/uploads/")) {
      const localDiskPath = path.join(process.cwd(), "public", preview.replace(/^\//, ""));
      if (fs.existsSync(localDiskPath)) {
        const buffer = fs.readFileSync(localDiskPath);
        const ext = path.extname(localDiskPath).toLowerCase();
        const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            "Content-Disposition": `inline; filename="mockup-${cleanId}${ext}"`,
          },
        });
      }
      return NextResponse.redirect(new URL(preview, req.url));
    }

    // 5. If preview is a valid Cloudinary or HTTP image URL, redirect directly
    if (preview && (preview.startsWith("http://") || preview.startsWith("https://"))) {
      return NextResponse.redirect(preview);
    }

    // 6. Tier 3: If design document was found (plain garment design), redirect to catalog product color photo
    if (design) {
      const product = REVERSE_ENGINEERED_PRODUCTS.find(
        (p) => p.id === design.productId || p.name === design.productName
      );
      if (product) {
        const color = product.colors?.find(
          (c) => c.name.toLowerCase() === (design.colorName || "").toLowerCase()
        );
        const garmentPhoto =
          color?.front ||
          color?.photoFront ||
          product.colors?.[0]?.front ||
          product.colors?.[0]?.photoFront ||
          product.colours?.[0]?.front ||
          "";
        if (garmentPhoto) {
          if (garmentPhoto.startsWith("/")) {
            return NextResponse.redirect(new URL(garmentPhoto, req.url));
          }
          return NextResponse.redirect(garmentPhoto);
        }
      }
    }

    // 7. Check default blank fallback on disk
    const defaultBlank = path.join(process.cwd(), "public", "blanks", "oversized-tee-250-gsm-french-terry-beige.jpg");
    if (fs.existsSync(defaultBlank)) {
      const buffer = fs.readFileSync(defaultBlank);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
          "Content-Disposition": `inline; filename="mockup-${cleanId}.jpg"`,
        },
      });
    }

    // 8. Final Fallback to logo
    return NextResponse.redirect(new URL("/logo.png", req.url));
  } catch (error: any) {
    console.error("Mockup endpoint error:", error);
    return NextResponse.redirect(new URL("/logo.png", req.url));
  }
}
