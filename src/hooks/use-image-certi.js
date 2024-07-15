import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  removeCertiImage,
  removeCertiImageData,
  updateCertiAvatar,
  updateCertiImages,
  updateCertiImagesData,
} from "../store"; 
export default function useImageCerti(setValue) {
  const dispatch = useDispatch();
  const { images, imagesData, avatar } = useSelector((state) => state.certiForm);

  const handleCertiImages = (e) => {
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

    const imageUrls = [];
    const imagesShow = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result;
        imageUrls.push(base64String.split(",")[1]);
        imagesShow.push(base64String);

        if (imageUrls.length === files.length) {
          dispatch(updateCertiImages([...images, ...imagesShow]));
          dispatch(updateCertiImagesData([...imagesData, ...imageUrls]));
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteCertiImage = (idx) => {
    dispatch(removeCertiImage(idx));
    dispatch(removeCertiImageData(idx));
  };

  const changeCertiAvatar = (idx) => {
    dispatch(updateCertiAvatar(images[idx]));
  };

  const isCertiAvatar = (image) => {
    return image === avatar;
  };

  useEffect(() => {
    setValue("images", imagesData);
  }, [imagesData]);

  useEffect(() => {
    setValue("avatar", avatar);
  }, [avatar]);

  return { handleCertiImages, deleteCertiImage, changeCertiAvatar, isCertiAvatar };
}