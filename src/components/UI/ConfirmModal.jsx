import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, headerContent, content}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{headerContent}</h2>
        <p>{content}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Đồng ý</button>
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
