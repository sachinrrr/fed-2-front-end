import { Input } from "./ui/input";
import { useAuth } from "@clerk/clerk-react";

function ImageInput({ onChange, value }) {
  const { getToken } = useAuth();

  const handleFileChange = async (e) => {
    try {
      if (!e.target.files) {
        return;
      }
      const file = e.target.files[0];
      if (!file) {
        return;
      }

      // Get auth token
      const token = await getToken();

      // First, get the pre-signed URL
      const response = await fetch("http://localhost:8000/api/products/images", {
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
      // Clear the file input on error
      e.target.value = "";
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input 
        type="file" 
        onChange={handleFileChange} 
        accept="image/*"
      />
      {value && (
        <img 
          src={value} 
          alt="Preview" 
          className="mt-2 max-w-[200px] h-auto rounded-lg border"
        />
      )}
    </div>
  );
}

export default ImageInput;