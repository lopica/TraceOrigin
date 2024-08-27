import React, { useState } from 'react';

const InputTextModal = ({ isOpen, onClose, onConfirm, headerContent, isLoading, textAreaValue, setTextAreaValue }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmClick = () => {
    if (textAreaValue.trim() === '') {
      setErrorMessage('Nội dung không được để trống.');
      return;
    }

    if (textAreaValue.length > 500) {
      setErrorMessage('Nội dung không được vượt quá 500 ký tự.');
      return;
    }

    setErrorMessage('');
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <dialog id="confirm_modal" className="modal bg-black bg-opacity-50" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{headerContent}</h3>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded-lg"
          value={textAreaValue}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
            if (e.target.value.length <= 500) {
              setErrorMessage('');
            }
          }}
        />
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <div className="modal-action">
          {isLoading ? (
            <span className="loading loading-spinner text-info mr-3"></span>
          ) : (
            <button
              className="btn btn-success"
              onClick={handleConfirmClick}
              disabled={isLoading || textAreaValue.trim() === '' || textAreaValue.length > 500}
            >
              Đồng ý
            </button>
          )}
          <button className="btn btn-error" onClick={onClose} disabled={isLoading}>
            Đóng
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default InputTextModal;
