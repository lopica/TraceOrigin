import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  removeProductEditImage,
  removeProductEditImageData,
  updateProductEditImages,
  updateProductEditImagesData,
  updateProductEditAvatar,
  resetState,
} from "../store";

let imageUrls = [];
let imagesShow = [];

export default function useImageEditPro(setValue) {
  const dispatch = useDispatch();
  const { images, imagesData, avatar } = useSelector((state) => state.productEditForm);

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
          dispatch(updateProductEditImages([...images, ...imagesShow]));
          dispatch(updateProductEditImagesData([...imagesData, ...imageUrls]));
          imageUrls = [];
          imagesShow = [];
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (idx) => {
    dispatch(removeProductEditImage(idx));
    dispatch(removeProductEditImageData(idx));
  };

  const changeAvatar = (idx) => {
    dispatch(updateProductEditAvatar(images[idx]));
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

  return { handleImages, deleteImage, changeAvatar, isAvatar, resetStateAction: resetState };
}
