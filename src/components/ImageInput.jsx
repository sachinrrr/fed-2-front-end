import { Input } from "./ui/input";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

function ImageInput({ onChange, value }) {
  const { getToken } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e) => {
    try {
      setUploadError("");
      setUploading(true);
      
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
      if (!file) {
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Please select a valid image file");
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB");
      }

      // Get auth token
      const token = await getToken();

      // First, get the pre-signed URL  
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/products/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fileType: file.type,
          fileName: file.name
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { url, publicURL } = await response.json();

      // Upload to Cloudflare R2
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Set the public URL as the value
      onChange(publicURL);

    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
      // Clear the file input on error
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*"
        disabled={uploading}
      />
      
      {uploading && (
        <div className="text-sm text-blue-600">
          Uploading image...
        </div>
      )}
      
      {uploadError && (
        <div className="text-sm text-red-600">
          {uploadError}
        </div>
      )}
      
      {value && !uploading && (
        <div className="mt-2">
          <img 
            src={value} 
            alt="Product preview" 
            className="max-w-[200px] h-auto rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}

export default ImageInput;