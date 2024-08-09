export async function convertLinkToBase64(url) {
    try {
      // Fetch the STL file
      const response = await fetch(url);
      
      // Ensure the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      // Read the response as a Blob
      const blob = await response.blob();
  
      // Create a FileReader to read the blob as a data URL (Base64)
      const reader = new FileReader();
      reader.readAsDataURL(blob);
  
      // Return a promise that resolves with the Base64 string
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result); // Split to remove the prefix (data:...)
        reader.onerror = reject;
      });
    } catch (error) {
      console.error('Error converting STL to Base64:', error);
      throw error;
    }
  }