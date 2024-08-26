import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Modal from "./Modal";
import Button from "./Button";
import {
  useRequestScanImageMutation,
  useGetImageHadUploadQuery,
} from "../../store/apis/productApi";
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
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");
  const [hasNewLinks, setHasNewLinks] = useState(false); // Track if there are new links
  const [requestScanImage] = useRequestScanImageMutation();
  const {
    data: uploadedTexts,
    isLoading,
    refetch,
  } = useGetImageHadUploadQuery({ productId });
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
    setError("");
  };

  const handleAddText = () => {
    if (!inputText.startsWith("http://") && !inputText.startsWith("https://")) {
      setError("Liên kết phải bắt đầu bằng http:// hoặc https://");
      return;
    }

    if (inputText) {
      const updatedTexts = [...texts, inputText];
      setTexts(updatedTexts);
      onTextReportsChange && onTextReportsChange(updatedTexts);
      setInputText("");
      setHasNewLinks(true);
    }
  };

  const handleDelete = (idx) => {
    const updatedTexts = texts.filter((_, index) => index !== idx);
    setTexts(updatedTexts);
    onTextReportsChange && onTextReportsChange(updatedTexts);
  };

  const handleSubmitTexts = async () => {
    const newTexts = texts.filter((text) => !uploadedTexts.includes(text));

    if (newTexts.length === 0) return; // Do nothing if there are no new links

    const data = {
      productId,
      image: newTexts,
    };

    try {
      setIsLoadingButton(true);
      await requestScanImage(data).unwrap();
      setIsLoadingButton(false);
      setTexts([]);
      setHasNewLinks(false); // Reset hasNewLinks after submission
      getToast(
        "Quản trị viên đã nhận được yêu cầu, quản trị viên sẽ nhắn tin lại cho bạn sớm nhất"
      );
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
      <div className="p-8 max-w-lg mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
            <FaInfoCircle className="text-blue-500 mr-2" />
            Tải lên đường link nhận diện
          </h2>
          <p className="text-base text-gray-600 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Vui lòng sử dụng liên kết Google Drive để tải lên tối thiểu 25 ảnh.
            Ảnh nên được chụp rõ ràng, đủ ánh sáng và nền sạch.
          </p>
        </div>
        {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="flex flex-col gap-4 relative">
            <div className="flex flex-wrap gap-4">
              {texts.map((text, idx) => (
                <div
                  key={idx}
                  className="relative p-4 border rounded-lg bg-gray-100 w-full max-w-md"
                >
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
              {error && (
                <p className="text-red-500 mt-2">{error}</p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handleAddText}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                >
                  Thêm link
                </button>
                <div className="flex items-center space-x-2">
                  {isLoadingButton ? (
                    <span className="loading loading-spinner loading-lg"></span>
                  ) : (
                    <button
                      onClick={handleSubmitTexts}
                      disabled={!hasNewLinks}
                      className={`p-2 ${
                        hasNewLinks
                          ? "bg-blue-500 hover:bg-blue-700"
                          : "bg-gray-300"
                      } text-white rounded-md`}
                    >
                      Gửi yêu cầu
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
