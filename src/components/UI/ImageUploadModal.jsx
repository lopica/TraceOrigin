import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import { useRequestScanImageMutation, useGetImageHadUploadQuery } from '../../store/apis/productApi';
import useToast from "../../hooks/use-toast";

export default function TextUploadModal({
  isOpen,
  onClose,
  productId,
  textReports,
  onTextReportsChange,
}) {
  const [texts, setTexts] = useState([]);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [inputText, setInputText] = useState('');
  const [requestScanImage] = useRequestScanImageMutation();
  const { data: uploadedTexts, isLoading, refetch } = useGetImageHadUploadQuery({ productId });
  const { getToast } = useToast();
  useEffect(() => {
    setTexts(textReports || []);
  }, [textReports]);

  useEffect(() => {
    if (uploadedTexts) {
      setTexts((prevTexts) => [...uploadedTexts, ...prevTexts]);
    }
  }, [uploadedTexts]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleAddText = () => {
    if (inputText) {
      const updatedTexts = [...texts, inputText];
      setTexts(updatedTexts);
      onTextReportsChange && onTextReportsChange(updatedTexts);
      setInputText('');
    }
  };

  const handleDelete = (idx) => {
    const updatedTexts = texts.filter((_, index) => index !== idx);
    setTexts(updatedTexts);
    onTextReportsChange && onTextReportsChange(updatedTexts);
  };

  const handleSubmitTexts = async () => {
    const newTexts = texts.filter(text => !uploadedTexts.includes(text));

    const data = {
      productId,
      image: newTexts,
    };

    try {
      setIsLoadingButton(true);
      await requestScanImage(data).unwrap();
      setIsLoadingButton(false);
      setTexts([]);
      getToast("Quản trị viên đã nhận được yêu cầu, quản trị viên sẽ nhắn tin lại cho bạn sớm nhất")
      refetch();
      onClose();
    } catch (error) {
      setIsLoadingButton(false);
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="py-4 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-2">Tải lên đường link nhận diện</h2>
        <p className="text-gray-600 mb-4">Vui lòng đính kèm tối thiểu 25 ảnh, ảnh nên được chụp rõ ràng, đủ ánh sáng và nền sạch</p>
        {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="flex flex-col gap-4 relative">
            <div className="flex flex-wrap gap-4">
              {texts.map((text, idx) => (
                <div key={idx} className="relative p-4 border rounded-lg bg-gray-100 w-full max-w-md">
                  <p className="text-sm text-gray-700 break-words">{text}</p>
                  {!uploadedTexts.includes(text) && (
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
            </div>
            <div className="w-full mt-4">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Dán link ở đây !!!"
                className="p-2 w-full border rounded resize-none"
                rows="3"
              />
              <button
                onClick={handleAddText}
                className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              >
                Thêm link
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          {isLoadingButton ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <button
              onClick={handleSubmitTexts}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Gửi yêu cầu
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
