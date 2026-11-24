import { NextRequest, NextResponse } from "next/server";
import { resolveImage } from "@/lib/image-storage";
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
    const cleanId = rawId.replace(/\.(png|jpe?g|webp)$/i, "").trim();

    if (!cleanId) {
      return NextResponse.redirect(new URL("/logo.png", req.url));
    }

    // 1. Resolve from Image Storage (Memory Cache, Local Disk, /tmp, MongoDB Asset/Design)
    const resolved = await resolveImage(rawId);
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

    // Also check without extension if rawId had extension
    if (cleanId !== rawId) {
      const resolvedClean = await resolveImage(cleanId);
      if (resolvedClean) {
        return new NextResponse(new Uint8Array(resolvedClean.buffer), {
          status: 200,
          headers: {
            "Content-Type": resolvedClean.contentType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            "Content-Disposition": `inline; filename="${resolvedClean.filename}"`,
          },
        });
      }
    }

    // 2. Check MongoDB Design / Quote for previewUrl or Cloudinary URL
    let design: any = null;
    let preview = "";

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
          "";
      }

      if (!preview) {
        const quote = await Quote.findOne({
          $or: [
            { "items.designPreviewUrl": { $regex: escapedCleanId, $options: "i" } },
            { notes: { $regex: escapedCleanId, $options: "i" } },
          ],
        });
        if (quote && quote.items && quote.items.length > 0) {
          const item =
            quote.items.find(
              (it: any) =>
                it.designPreviewUrl &&
                it.designPreviewUrl.toLowerCase().includes(cleanId.toLowerCase())
            ) || quote.items[0];
          preview = item?.designPreviewUrl || "";
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB connection notice in mockup route:", dbErr);
    }

    // If preview is a base64 Data URI, decode and stream
    if (preview && preview.startsWith("data:image")) {
      const matches = preview.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const format = matches[1].toLowerCase();
        const mimeType =
          format.includes("jpeg") || format.includes("jpg")
            ? "image/jpeg"
            : "image/png";
        const buffer = Buffer.from(matches[2], "base64");
        return new NextResponse(new Uint8Array(buffer), {
          status: 200,
          headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            "Content-Disposition": `inline; filename="mockup-${cleanId}.png"`,
          },
        });
      }
    }

    // If preview is a direct HTTP/HTTPS URL, redirect
    if (preview && (preview.startsWith("http://") || preview.startsWith("https://"))) {
      return NextResponse.redirect(preview);
    }

    // 3. Fallback: Return garment photo from catalog if design exists
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

    // 4. Default fallback: first catalog blank photo or logo
    const defaultProduct = REVERSE_ENGINEERED_PRODUCTS[0];
    const defaultPhoto =
      defaultProduct?.colors?.[0]?.front ||
      defaultProduct?.colours?.[0]?.front ||
      "/blanks/oversized-tee-250-gsm-french-terry-beige.jpg";

    if (defaultPhoto) {
      return NextResponse.redirect(new URL(defaultPhoto, req.url));
    }

    return NextResponse.redirect(new URL("/logo.png", req.url));
  } catch (error: any) {
    console.error("Mockup endpoint caught error:", error);
    return NextResponse.redirect(new URL("/logo.png", req.url));
  }
}
