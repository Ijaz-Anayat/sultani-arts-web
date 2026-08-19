import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on Vercel, then redeploy.",
    );
  }

  if (/^root$/i.test(cloud_name)) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME is set to Root, which is a folder name. Use the Cloud name from the Cloudinary dashboard (Settings → Product environment credentials).",
    );
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
}

export { cloudinary };

export async function uploadProductImage(buffer: Buffer) {
  configureCloudinary();

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sultani-arts/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary did not return a URL"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
