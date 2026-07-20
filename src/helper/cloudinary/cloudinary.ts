import { Result } from "pg";
import cloudinary from "../../utils/cloudinary";
import { UploadApiResponse } from "cloudinary";
export const uploadCloudinary = async (file: Buffer, folder = "products"): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result!)
      },
    );
    upload.end(file)
  });
};
