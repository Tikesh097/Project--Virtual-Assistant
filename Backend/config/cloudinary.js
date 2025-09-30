import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Configure once at the top (not inside the function)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // auto-detect image/video
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return uploadResult.secure_url; // return only the secure URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // Cleanup file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null; // let controller handle error response
  }
};
