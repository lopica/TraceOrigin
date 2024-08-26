import React from 'react';

const ConfirmDeleteModal = ({ show, onClose, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h1 className="text-xl font-semibold mb-4">Xác nhận xoá tài khoản hỗ trợ</h1>
        <p>Bạn có chắc muốn xoá tài khoản này không?</p>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
