import React from 'react';

const InputTextModal = ({ isOpen, onClose, onConfirm, headerContent, isLoading, textAreaValue, setTextAreaValue }) => {
    const handleConfirmClick = () => {
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
            onChange={(e) => setTextAreaValue(e.target.value)}
          />
          <div className="modal-action">
            {isLoading ? (
              <span className="loading loading-spinner text-info mr-3"></span>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleConfirmClick}
                disabled={isLoading}
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