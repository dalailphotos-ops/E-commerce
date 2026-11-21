import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Design from "@/models/Design";
import Quote from "@/models/Quote";
import { REVERSE_ENGINEERED_PRODUCTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id || "";
    // Clean id: strip file extension if provided (e.g. ASSON-123.png -> ASSON-123)
    const cleanId = rawId.replace(/\.(png|jpe?g|webp)$/i, "").trim();

    if (!cleanId) {
      return NextResponse.redirect(new URL("/logo.png", req.url));
    }

    await connectToDatabase();

    // 1. Query Design document by exact designId, case-insensitive designId, or MongoDB _id
    const escapedCleanId = cleanId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const idRegex = new RegExp(`^${escapedCleanId}$`, "i");

    let design = await Design.findOne({
      $or: [
        { designId: cleanId },
        { designId: { $regex: idRegex } },
        ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : []),
      ],
    });

    let preview = "";

    if (design) {
      preview =
        design.previewUrl ||
        design.frontPreviewUrl ||
        design.backPreviewUrl ||
        design.artworkUrl ||
        (Array.isArray(design.uploadedAssets) && design.uploadedAssets[0]) ||
        "";
    }

    // 2. If not found in Design or preview is empty, check Quote collection
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

    // 4. If preview is a valid Cloudinary or HTTP image URL, redirect directly
    if (preview && (preview.startsWith("http://") || preview.startsWith("https://"))) {
      return NextResponse.redirect(preview);
    }

    // 5. If design document was found but had no uploaded preview (plain garment design),
    // redirect to catalog product color photo
    if (design) {
      const product = REVERSE_ENGINEERED_PRODUCTS.find(
        (p) => p.id === design.productId || p.name === design.productName
      );
      if (product) {
        const color = product.colors?.find(
          (c) => c.name.toLowerCase() === (design.colorName || "").toLowerCase()
        );
        const garmentPhoto =
          color?.photoFront ||
          color?.front ||
          product.colors?.[0]?.photoFront ||
          product.colours?.[0]?.front ||
          "";
        if (garmentPhoto) {
          return NextResponse.redirect(garmentPhoto);
        }
      }
    }

    // Fallback
    return NextResponse.redirect(new URL("/logo.png", req.url));
  } catch (error: any) {
    console.error("Mockup endpoint error:", error);
    return NextResponse.redirect(new URL("/logo.png", req.url));
  }
}
