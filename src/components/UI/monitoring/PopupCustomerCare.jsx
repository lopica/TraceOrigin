import React, { useState } from "react";
import { useUpdateStatusMutation } from "../../../store/apis/customercareApi";
import useToast from "../../../hooks/use-toast";
import {
  FaTimesCircle,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

const PopupCustomerCare = ({ isOpen, onClose, refetch, item }) => {
  if (!isOpen || !item) return null;

  const [updateStatus] = useUpdateStatusMutation();
  const [note, setNote] = useState("");
  const { getToast } = useToast();
  const [errorMsg, setErrorMsg] = useState("");

  const onConfirm = async (careId, st) => {
    if (!note) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
      try {
        const updateStatusData = {
          careId: careId,
          status: st,
          note: note,
        };
        const result = await updateStatus(updateStatusData).unwrap();
        getToast("Cập nhật trạng thái thành công");
      } catch (error) {
        console.error(error);
      }
      refetch();
    }
  };

  const onNoteChange = (value) => {
    setNote(value);
  };

  const alertClass = errorMsg ? "block" : "hidden";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 rounded-md w-1/3">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-lg font-bold mb-2">Chi tiết ghi chú</h2>
        <div className="mb-4">
          <p>
            <strong>Khách hàng: </strong>
            {item.customerName}
          </p>
          <p>
            <strong>Nội dung: </strong>
            {item.content}
          </p>
          <p className="mb-2"></p>
          <p className="text-gray-500">
            Thời gian: {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
        {item.note ? (
          <div className="mt-4">
            <strong>Ghi chú: </strong>
            <p>{item.note}</p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <strong>Trả lời: </strong>
            </div>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full h-32"
            />
            <div className={`flex items-center mt-2 ${alertClass}`}>
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
              <span className="text-yellow-500">
                Bạn cần ghi note trước khi bấm nút hành động
              </span>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => onConfirm(item.careId, 1)}
                className="flex items-center p-1 rounded-full bg-green-500 hover:bg-green-400 text-white space-x-2"
              >
                <FaCheckCircle size={24} />
                <span>Xử lý thành công</span>
              </button>
              <button
                onClick={() => onConfirm(item.careId, 2)}
                className="flex items-center p-1 rounded-full bg-red-500 hover:bg-red-400 text-white space-x-2"
              >
                <FaCheckCircle size={24} />
                <span>Xử lý thất bại</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupCustomerCare;
