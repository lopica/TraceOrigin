import { useDispatch, useSelector } from "react-redux";
import {
  removeImage,
  removeImageData,
  updateAvatar,
  updateImages,
  updateImagesData,
  updateForm,
  resetState,
  // Import các action từ certiForm
  updateCertiCategories,
  removeCertiImage,
  removeCertiImageData,
  updateCertiAvatar,
  updateCertiImages,
  updateCertiImagesData,
  updateCertiForm,
  resetCertiState,
} from "../store";
import { useEffect } from "react";

let imageUrls = [];
let imagesShow = [];

export default function useImage(setValue, isCer) {
  const dispatch = useDispatch();
  const { images, imagesData, avatar } = useSelector((state) =>
    isCer ? state.certiForm : state.productForm
  );

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    // Check if any files were selected
    if (files.length === 0) {
      alert("Bạn hãy chọn ít nhất 1 ảnh.");
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
          if (isCer) {
            dispatch(updateCertiImages([...images, ...imagesShow]));
            dispatch(updateCertiImagesData([...imagesData, ...imageUrls]));
          } else {
            dispatch(updateImages([...images, ...imagesShow]));
            dispatch(updateImagesData([...imagesData, ...imageUrls]));
          }
          imageUrls = [];
          imagesShow = [];
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (idx) => {
    if (isCer) {
      dispatch(removeCertiImage(idx));
      dispatch(removeCertiImageData(idx));
    } else {
      dispatch(removeImage(idx));
      dispatch(removeImageData(idx));
    }
  };

  const changeAvatar = (idx) => {
    if (isCer) {
      dispatch(updateCertiAvatar(images[idx]));
    } else {
      dispatch(updateAvatar(images[idx]));
    }
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

  // Reset state based on isCer
  const resetStateAction = isCer ? resetCertiState : resetState;

  return { handleImages, deleteImage, changeAvatar, isAvatar, resetStateAction };
}
