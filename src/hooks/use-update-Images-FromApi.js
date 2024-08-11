import { useDispatch } from "react-redux";
import {
  updateProductEditImages,
  updateProductEditImagesData,
  updateProductEditAvatar,
} from "../store";

const urlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const secureUrl = url.replace("http://", "https://");
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open("GET", secureUrl);
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
      const avatarBase64 = await urlToBase64(avatar);
      base64Images.forEach((base64) => {
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
