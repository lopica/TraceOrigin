// useCertiImage.js
import { useDispatch, useSelector } from "react-redux";
import {
  updateCertiCategories,
  removeCertiImage,
  removeCertiImageData,
  updateCertiAvatar,
  updateCertiImages,
  updateCertiImagesData,
  resetCertiState,
} from "../store";
import { useEffect } from "react";

let imageUrls = [];
let imagesShow = [];

export default function useCertiImage(setValue) {
  const dispatch = useDispatch();
  const { images, imagesData, avatar } = useSelector((state) => state.certiForm);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      alert("Bạn hãy chọn ít nhất 1 ảnh.");
      return;
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024;

    if (totalSize > 25) {
      alert("Tổng kích thước của tất cả các file phải ít hơn là 25 MB.");
      return;
    }

    if (images.length + files.length > 5) {
      alert("Bạn không thể chọn quá 5 ảnh.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result;
        imageUrls.push(base64String.split(",")[1]);
        imagesShow.push(base64String);

        if (imageUrls.length === files.length) {
          dispatch(updateCertiImages([...images, ...imagesShow]));
          dispatch(updateCertiImagesData([...imagesData, ...imageUrls]));
          imageUrls = [];
          imagesShow = [];
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (idx) => {
    dispatch(removeCertiImage(idx));
    dispatch(removeCertiImageData(idx));
  };

  const changeAvatar = (idx) => {
    dispatch(updateCertiAvatar(images[idx]));
  };

  const isAvatar = (image) => {
    return image === avatar;
  };

  useEffect(() => {
    setValue("images", imagesData);
  }, [imagesData, setValue]);

  useEffect(() => {
    setValue("avatar", avatar);
  }, [avatar, setValue]);

  return { handleImages, deleteImage, changeAvatar, isAvatar, resetStateAction: resetCertiState };
}
