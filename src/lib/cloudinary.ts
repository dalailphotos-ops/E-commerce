import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder: string = "looma_apparels"
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
          if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
    } else {
      // Buffer upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
      uploadStream.end(fileBuffer);
    }
  });
}

export { cloudinary };
