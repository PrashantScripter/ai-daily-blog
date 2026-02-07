// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads an image Buffer to Cloudinary
 */

// types/cloudinary.ts
export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}

export interface UploadOptions {
  publicId?: string;
  folder?: string;
  tags?: string[];
  transformation?: any[];
}

export interface GeminiImageResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inlineData?: {
          mimeType: string;
          data: string;
        };
        text?: string;
      }>;
    };
  }>;
}

export async function uploadImageBuffer(
  imageBuffer: Buffer,
  options?: UploadOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder || "gemini-generated",
        tags: options?.tags || ["gemini", "generated"],
        public_id: options?.publicId,
        transformation: options?.transformation,
        upload_preset: process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("No result from Cloudinary upload"));
        }
      },
    );

    uploadStream.end(imageBuffer);
  });
}
