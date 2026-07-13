/**
 * Helper utility to construct a valid image URL from paths returned by the backend.
 * Handles cleaning of Windows backslashes and prefixing the API host URL.
 * 
 * @param {string} imagePath - The path or URL of the image.
 * @param {string} fallbackUrl - Fallback URL to return if imagePath is invalid/missing.
 * @returns {string} The fully resolved image URL.
 */
export const getImageUrl = (imagePath, fallbackUrl = "https://via.placeholder.com/300") => {
  if (!imagePath) return fallbackUrl;
  
  // Return early if it's already a full URL or base64 data URI
  if (
    imagePath.startsWith("http://") || 
    imagePath.startsWith("https://") || 
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  
  if (imagePath === "default_shop_placeholder.jpg") {
    return "https://via.placeholder.com/150";
  }

  // Clean backslashes for URL formatting
  const cleanPath = imagePath.replace(/\\/g, "/");
  
  // Return the fully resolved path to the backend public uploads directory
  return `http://localhost:5000/${cleanPath}`;
};
