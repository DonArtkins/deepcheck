import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with error handling
const configureCloudinary = () => {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  // Validate that all required environment variables are present
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.error("Missing Cloudinary configuration:", {
      cloud_name: !!config.cloud_name,
      api_key: !!config.api_key,
      api_secret: !!config.api_secret,
    });
    throw new Error(
      "Cloudinary configuration is incomplete. Please check your environment variables."
    );
  }

  console.log("Configuring Cloudinary with:", {
    cloud_name: config.cloud_name,
    api_key: config.api_key
      ? `${config.api_key.substring(0, 6)}...`
      : "missing",
    api_secret: config.api_secret ? "present" : "missing",
  });

  cloudinary.config(config);

  return cloudinary;
};

// Initialize and export configured Cloudinary instance
const configuredCloudinary = configureCloudinary();

export default configuredCloudinary;
