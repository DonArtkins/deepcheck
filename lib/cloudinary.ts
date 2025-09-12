import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CloudinaryCloudName,
  api_key: process.env.CloudinaryApiKey,
  api_secret: process.env.CloudinaryApiSecret,
});

export default cloudinary;
