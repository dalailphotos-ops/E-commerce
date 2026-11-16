import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  if (
    process.env.CLOUDINARY_URL &&
    process.env.CLOUDINARY_URL.startsWith("cloudinary://")
  ) {
    return true;
  }
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "demo" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder: string = "asson_clothing"
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    // If it's a base64 string or URL
    if (typeof fileBuffer === "string") {
      cloudinary.uploader.upload(
        fileBuffer,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("Cloudinary upload failed"));
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
    } else {
      // Buffer upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error || !result)
            return reject(error || new Error("Cloudinary upload failed"));
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
      uploadStream.end(fileBuffer);
    }
  });
}

export { cloudinary };
