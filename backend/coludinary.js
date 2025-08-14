import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const connectCloudinary = () => {
  if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
    console.error("❌ Missing Cloudinary environment variables");
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  console.log("☁️  Cloudinary Connected");
};

export { cloudinary, connectCloudinary };


