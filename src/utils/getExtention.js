export const getExtension = (base64String) => {
  // Define a mapping from MIME types to file extensions
  const mimeToExt = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/json": "json",
    "application/zip": "zip",
    "application/x-7z-compressed": "7z",
    "text/plain": "txt",
    "application/sla": "stl",
    "model/gltf-binary": "glb",
    "model/gltf+json": "gltf",
    "application/octet-stream": "bin",
    "model/obj": "obj",
    "model/x3d+xml": "x3d",
    "application/vnd.ms-pki.stl": "stl",
    "model/vnd.ms-pki.stl": "stl",
    "application/octet-stream": "3ds",
    "application/x-3ds": "3ds",
    "application/x-ply": "ply",
    // Add more mappings as needed
  };

  // Extract the MIME type from the Base64 string
  const mimeType = base64String.match(/data:([a-zA-Z0-9\/\-\+\.]+);base64,/)?.[1];

  if (!mimeType) {
    throw new Error("Invalid Base64 string");
  }

  // Special handling for application/octet-stream
  if (mimeType === "application/octet-stream") {
    const byteCharacters = atob(base64String.split(",")[1]);
    const firstBytes = byteCharacters.slice(0, 4);

    // Check for GLB (Binary glTF) magic number: "glTF" (0x676C5446)
    if (firstBytes === "glTF") {
      return "glb";
    }

    // Check for 3DS magic number (0x4D4D)
    if (byteCharacters.charCodeAt(0) === 0x4D && byteCharacters.charCodeAt(1) === 0x4D) {
      return "3ds";
    }

    // Check for ASCII STL starting with "solid"
    if (firstBytes === "solid") {
      return "stl";
    }

    // Check for Binary STL format
    if (byteCharacters.length >= 80) {
      const header = byteCharacters.slice(0, 80);
      const trianglesCount = byteCharacters.charCodeAt(80) | (byteCharacters.charCodeAt(81) << 8);
      if (header && trianglesCount > 0) {
        return "stl";
      }
    }

    // Attempt to parse as JSON to detect glTF
    try {
      JSON.parse(byteCharacters);
      return "gltf";
    } catch (e) {
      // Not a valid JSON, continue with other checks
    }
  }

  // Check for model/gltf+json MIME type
  if (mimeType === "model/gltf+json") {
    return "gltf";
  }

  // Get the file extension from the MIME type mapping
  const fileExtension = mimeToExt[mimeType];

  if (!fileExtension) {
    throw new Error(`Unsupported MIME type: ${mimeType}`);
  }

  console.log(fileExtension);
  return fileExtension;
};



export const getMimeTypeFromBase64 = (base64String) => {
    console.log(base64String.match(/data:([a-zA-Z0-9\/\-\+\.]+);base64,/)?.[1])
  return base64String.match(/data:([a-zA-Z0-9\/\-\+\.]+);base64,/)?.[1];
};
