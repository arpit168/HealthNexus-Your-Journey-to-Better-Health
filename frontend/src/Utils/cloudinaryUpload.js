/**
 * Direct Cloudinary upload from frontend using unsigned upload preset.
 * This bypasses the backend entirely for file uploads, avoiding
 * API key permission issues on the server side.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dag8ppbzu";
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "healthnexus_unsigned";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a file directly to Cloudinary using an unsigned preset.
 * @param {File} file - The image file to upload
 * @param {object} options - Optional overrides (folder, etc.)
 * @returns {Promise<{url: string, publicID: string}>}
 */
export const uploadToCloudinary = async (file, options = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", options.folder || "HealthNexus/User");

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message || `Cloudinary upload failed (${response.status})`,
    );
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicID: data.public_id,
  };
};

export default uploadToCloudinary;
