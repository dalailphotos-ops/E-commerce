import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { connectToDatabase } from "./mongodb";
import Asset from "@/models/Asset";
import Design from "@/models/Design";
import Quote from "@/models/Quote";

interface CachedImage {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __IMAGE_STORAGE_CACHE__: Map<string, CachedImage> | undefined;
}

if (!global.__IMAGE_STORAGE_CACHE__) {
  global.__IMAGE_STORAGE_CACHE__ = new Map<string, CachedImage>();
}

const memoryCache = global.__IMAGE_STORAGE_CACHE__;

/**
 * Saves an image to memory cache, disk (public/uploads or os.tmpdir), and MongoDB.
 * Never throws EROFS error.
 */
export async function saveImage({
  id,
  filename,
  buffer,
  contentType,
  type = "artwork",
  designId,
}: {
  id: string;
  filename: string;
  buffer: Buffer;
  contentType: string;
  type?: string;
  designId?: string;
}): Promise<{ savedPath: string; url: string }> {
  // 1. Store in memory cache
  memoryCache.set(id.toLowerCase(), {
    buffer,
    contentType,
    timestamp: Date.now(),
  });
  memoryCache.set(filename.toLowerCase(), {
    buffer,
    contentType,
    timestamp: Date.now(),
  });

  // Limit cache size to 100 items
  if (memoryCache.size > 150) {
    const oldestKey = memoryCache.keys().next().value;
    if (oldestKey) memoryCache.delete(oldestKey);
  }

  // 2. Safe disk write (public/uploads with fallback to os.tmpdir)
  const folder = type === "mockup" ? "mockups" : "artworks";
  let savedPath = "";

  try {
    const publicDir = path.join(process.cwd(), "public", "uploads", folder);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicFilePath = path.join(publicDir, filename);
    fs.writeFileSync(publicFilePath, buffer);
    savedPath = publicFilePath;
  } catch (err: any) {
    // Expected on read-only serverless filesystems (e.g. Vercel, AWS Lambda)
    try {
      const tmpDir = path.join(os.tmpdir(), "uploads", folder);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      const tmpFilePath = path.join(tmpDir, filename);
      fs.writeFileSync(tmpFilePath, buffer);
      savedPath = tmpFilePath;
    } catch (tmpErr) {
      console.warn("Failed to write to tmpdir:", tmpErr);
    }
  }

  // 3. Persistent MongoDB save (if database is accessible)
  try {
    await connectToDatabase();

    const dataBase64 = buffer.toString("base64");
    const dataUri = `data:${contentType};base64,${dataBase64}`;

    await Asset.findOneAndUpdate(
      { assetId: id },
      {
        assetId: id,
        filename,
        contentType,
        size: buffer.length,
        dataBase64,
        type,
        designId: designId || id,
      },
      { upsert: true, new: true }
    );

    if (designId) {
      const updateFields: Record<string, any> = {};
      if (type === "mockup") {
        updateFields.previewUrl = dataUri;
        updateFields.frontPreviewUrl = dataUri;
      } else {
        updateFields.artworkUrl = dataUri;
      }
      await Design.findOneAndUpdate(
        { designId },
        { $set: updateFields },
        { upsert: true }
      );
    }
  } catch (dbErr) {
    // If MongoDB is not connected, memoryCache and tmpdir serve the image
    console.warn("MongoDB asset save notice (using memory/disk cache):", dbErr);
  }

  return {
    savedPath,
    url: `/api/mockup/${filename}`,
  };
}

/**
 * Resolves an image buffer by ID or filename from:
 * 1. Memory cache
 * 2. Local disk (public/uploads or os.tmpdir)
 * 3. MongoDB Asset collection
 * 4. MongoDB Design / Quote collection
 */
export async function resolveImage(rawIdentifier: string): Promise<{
  buffer: Buffer;
  contentType: string;
  filename: string;
} | null> {
  if (!rawIdentifier) return null;

  const cleanIdentifier = rawIdentifier.replace(/\.(png|jpe?g|webp)$/i, "").trim();
  const lowerId = cleanIdentifier.toLowerCase();
  const lowerRaw = rawIdentifier.toLowerCase();

  // 1. Memory cache check
  const memCached = memoryCache.get(lowerRaw) || memoryCache.get(lowerId);
  if (memCached) {
    return {
      buffer: memCached.buffer,
      contentType: memCached.contentType,
      filename: rawIdentifier,
    };
  }

  // 2. Local disk check (both public/uploads and os.tmpdir)
  const candidateFilenames = [
    rawIdentifier,
    `${cleanIdentifier}.png`,
    `${cleanIdentifier}.jpg`,
    `${cleanIdentifier}-front.png`,
    `${cleanIdentifier}-front.jpg`,
    `${cleanIdentifier}-back.png`,
    `${cleanIdentifier}-back.jpg`,
  ];

  const searchDirs = [
    path.join(process.cwd(), "public", "uploads", "mockups"),
    path.join(process.cwd(), "public", "uploads", "artworks"),
    path.join(os.tmpdir(), "uploads", "mockups"),
    path.join(os.tmpdir(), "uploads", "artworks"),
  ];

  for (const dir of searchDirs) {
    for (const name of candidateFilenames) {
      const p = path.join(dir, name);
      try {
        if (fs.existsSync(p)) {
          const buf = fs.readFileSync(p);
          const ext = path.extname(name).toLowerCase();
          const contentType =
            ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".webp"
              ? "image/webp"
              : "image/png";
          // Populate memory cache
          memoryCache.set(lowerRaw, { buffer: buf, contentType, timestamp: Date.now() });
          return { buffer: buf, contentType, filename: name };
        }
      } catch (e) {
        // Continue searching
      }
    }
  }

  // 3. MongoDB Asset Collection
  try {
    await connectToDatabase();

    const asset = await Asset.findOne({
      $or: [
        { assetId: cleanIdentifier },
        { assetId: rawIdentifier },
        { filename: rawIdentifier },
        { filename: `${cleanIdentifier}.png` },
        { filename: `${cleanIdentifier}.jpg` },
        { designId: cleanIdentifier },
      ],
    });

    if (asset && asset.dataBase64) {
      const buf = Buffer.from(asset.dataBase64, "base64");
      const contentType = asset.contentType || "image/png";
      memoryCache.set(lowerRaw, { buffer: buf, contentType, timestamp: Date.now() });
      return { buffer: buf, contentType, filename: asset.filename || rawIdentifier };
    }
  } catch (dbErr) {
    console.warn("MongoDB Asset lookup notice:", dbErr);
  }

  // 4. MongoDB Design Collection
  try {
    await connectToDatabase();

    const design = await Design.findOne({
      $or: [
        { designId: cleanIdentifier },
        { designId: rawIdentifier },
        ...(cleanIdentifier.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanIdentifier }] : []),
      ],
    });

    if (design) {
      const isArtworkLookup =
        lowerRaw.startsWith("art_") || lowerRaw.startsWith("artwork");
      const targetUrl = isArtworkLookup
        ? design.artworkUrl || design.previewUrl || design.frontPreviewUrl
        : design.previewUrl || design.frontPreviewUrl || design.backPreviewUrl || design.artworkUrl;

      if (targetUrl && targetUrl.startsWith("data:image")) {
        const matches = targetUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          const format = matches[1].toLowerCase();
          const contentType =
            format.includes("jpeg") || format.includes("jpg")
              ? "image/jpeg"
              : "image/png";
          const buf = Buffer.from(matches[2], "base64");
          memoryCache.set(lowerRaw, { buffer: buf, contentType, timestamp: Date.now() });
          return { buffer: buf, contentType, filename: `${cleanIdentifier}.png` };
        }
      }
    }
  } catch (desErr) {
    console.warn("MongoDB Design lookup notice:", desErr);
  }

  return null;
}
