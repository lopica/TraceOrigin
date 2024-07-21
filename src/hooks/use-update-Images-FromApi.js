import { useDispatch } from "react-redux";
import {
  updateProductEditImages,
  updateProductEditImagesData,
  updateProductEditAvatar
} from "../store"; // Adjust the import path according to your file structure

const urlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
        resolve(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject; // Handle errors
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
};

export default function useUpdateImageFromApi() {
  const dispatch = useDispatch();

  const updateImagesFromApi = async (listImages, avatar) => {
    let imageUrls = [];
    let imagesShow = [];

    try {
      const base64Images = await Promise.all(listImages.map(urlToBase64));
      const avatarBase64 = await Promise.all(avatar.map(urlToBase64));
      base64Images.forEach((base64) => {
        imageUrls.push(base64);
        imagesShow.push(`data:image/png;base64,${base64}`);
      });
      avatarBase64.forEach((base64) => {
        imageUrls.push(base64);
        imagesShow.push(`data:image/png;base64,${base64}`);
      });

      dispatch(updateProductEditImages([...imagesShow]));
      dispatch(updateProductEditImagesData([...imageUrls]));
      dispatch(updateProductEditAvatar(`data:image/png;base64,${avatarBase64}`));
      
    } catch (error) {
      console.error("Error updating images from API:", error);
    }
  };

  return { updateImagesFromApi };
}
