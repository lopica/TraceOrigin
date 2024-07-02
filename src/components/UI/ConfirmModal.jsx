import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, headerContent, content, isLoading }) => {
  const handleConfirmClick = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <dialog id="confirm_modal" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{headerContent}</h3>
        <p className="py-4">{content}</p>
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

export default ConfirmationModal;
