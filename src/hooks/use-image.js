import { useDispatch, useSelector } from "react-redux";
import {
  removeImage,
  removeImageData,
  updateAvatar,
  updateImages,
  updateImagesData,
} from "../store";
import { useEffect } from "react";

let imageUrls = [];
let imagesShow = [];

export default function useImage(setValue) {
  const dispatch = useDispatch();
  const { images, imagesData, avatar } = useSelector(
    (state) => state.productForm
  );

  const handleImages = (e) => {
    console.log(e.target.files);
    const files = Array.from(e.target.files);

    // Check if any files were selected
    if (!files.length) {
      alert("Bạn hãy chọn ít nhất 1 ảnh.");
      dispatch(updateImages([]));
      dispatch(updateImagesData([]));
      return;
    }

    // Calculate total size of selected files
    const totalSize =
      files.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024; // Size in MB

    // Check total size limit
    if (totalSize > 25) {
      alert("Tổng kích thước của tất cả các file phải ít hơn là 25 MB.");
      return;
    }

    // Check the number of images
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

        // Check if all files are processed
        if (imageUrls.length === files.length) {
          dispatch(updateImages([...images, ...imagesShow]));
          dispatch(updateImagesData([...imagesData, ...imageUrls]));
          imageUrls = [];
          imagesShow = [];
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (idx) => {
    dispatch(removeImage(idx));
    dispatch(removeImageData(idx));
  };

  const changeAvatar = (idx) => {
    dispatch(updateAvatar(images[idx]));
  };

  const isAvatar = (image) => {
    return image === avatar;
  };

  const isValid = () => {
    console.log(imagesData.length > 0);
    return imagesData.length > 0;
  };

  useEffect(() => {
    setValue("images", imagesData);
  }, [imagesData]);

  useEffect(() => {
    setValue("avatar", avatar);
  }, [avatar]);

  return { handleImages, deleteImage, changeAvatar, isAvatar, isValid };
}
