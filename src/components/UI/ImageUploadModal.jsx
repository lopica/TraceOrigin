import React, { useRef, useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import { useRequestScanImageMutation, useGetImageHadUploadQuery } from '../../store/apis/productApi';

export default function ImageUploadModal({
  isOpen,
  onClose,
  productId,
  imageReports,
  onImageReportsChange,
}) {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [requestScanImage] = useRequestScanImageMutation();
  const { data: uploadedImages, isLoading, refetch} = useGetImageHadUploadQuery({ productId });

  useEffect(() => {
    setImages(imageReports);
  }, [imageReports]);

  useEffect(() => {
    if (uploadedImages) {
      setImages((prevImages) => [...uploadedImages, ...prevImages]);
    }
  }, [uploadedImages]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const maxSize = 10 * 1024 * 1024;
    const validFiles = Array.from(files).filter(file => {
        if (file.size > maxSize) {
            alert(`File ${file.name} có kích thước vượt quá 10MB, vui lòng chọn file khác.`);
            return false;
        }
        return true;
    });

    if (validFiles.length > 0) {
        const newImages = validFiles.map(file => URL.createObjectURL(file));
        setImages(prevImages => [...prevImages, ...newImages]);
        onImageReportsChange && onImageReportsChange(validFiles.map(file => file.split(',')[1]));
    }
};


  const handleDelete = (idx) => {
    const updatedImages = images.filter((_, index) => index !== idx);
    setImages(updatedImages);
    onImageReportsChange && onImageReportsChange(updatedImages.map(image => image.split(',')[1]));
  };

  const handleImageClick = (event, image) => {
    event.stopPropagation();
    setSelectedImage(image);
  };

  const closeDetailModal = () => {
    setSelectedImage(null);
  };

  const convertToBase64 = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  const handleSubmitImages = async () => {
    const newImages = images.filter(image => !uploadedImages.includes(image));

    if (images.length < 25) {
      alert('Bạn cần tải lên ít nhất 25 ảnh.');
      return;
    }

    const base64Images = [];
    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i];
      await new Promise(resolve => convertToBase64(image, (base64) => {
        base64Images.push(base64);
        resolve();
      }));
    }

    const data = {
      productId,
      image: base64Images,
    };

    try {
      setIsLoadingButton(true)
      await requestScanImage(data).unwrap();
      alert('Hình ảnh đã được gửi thành công!');
      setIsLoadingButton(false);
      setImages([]);
      refetch();
      onClose();
    } catch (error) {
      alert('Gửi hình ảnh thất bại');
      setIsLoadingButton(false)
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal onClose={onClose}>
        <div className="py-4 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">Tải lên hình ảnh nhận diện</h2>
          <p className="text-gray-600 mb-4">Vui lòng tải lên tối thiểu 25 ảnh. Ảnh nên được chụp ở nơi sáng và rõ nét để đảm bảo chất lượng tốt nhất.</p>
          {isLoading ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 relative">
              {images.map((image, idx) => (
                <div key={idx} className="relative min-w-24 min-h-24 max-w-24 max-h-24">
                  <img
                    src={image}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    alt={`Preview ${idx}`}
                    onClick={(event) => handleImageClick(event, image)}
                  />
                  {!uploadedImages.includes(image) && (
                    <Button
                      rounded
                      secondary
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(idx);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-700"
                    >
                      <FaTimes className="text-white" />
                    </Button>
                  )}
                </div>
              ))}
              <div
                className="group hover:bg-sky-300 p-4 flex items-center justify-center min-w-24 min-h-24 max-w-24 max-h-24 border-2 border-dashed border-sky-300 rounded-lg cursor-pointer relative"
              >
                <FaPlus className="text-3xl text-white" />
                <input
                  ref={fileInputRef}
                  name="images"
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/png, image/gif, image/jpeg"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            {isLoadingButton ? (
              <span className="loading loading-spinner loading-lg"></span>
            ):(
              <button
              onClick={handleSubmitImages}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Gửi hình ảnh
            </button>
            )}
          </div>
        </div>
      </Modal>

      {selectedImage && (
        <Modal onClose={closeDetailModal}>
          <div className="py-4 max-w-lg mx-auto">
            <img
              src={selectedImage}
              className="w-full h-full max-w-sm mx-auto object-cover rounded-lg"
              alt="Detailed view"
            />
            <button
              onClick={closeDetailModal}
              className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
