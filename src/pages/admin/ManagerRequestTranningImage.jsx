import React, { useState } from "react";
import Modal from "react-modal";
import { FaEye } from "react-icons/fa";
import { saveAs } from "file-saver";

const dummyData = [
  {
    productId: "P001",
    productName: "Sản phẩm 1",
    manufactorName: "Nhà sản xuất A",
    requestDate: 1625242800000,
    status: "Đang chờ xử lý",
    filePath: [
      "https://via.placeholder.com/150/1",
      "https://via.placeholder.com/150/2",
      "https://via.placeholder.com/150/3",
    ],
  },
  {
    productId: "P002",
    productName: "Sản phẩm 2",
    manufactorName: "Nhà sản xuất B",
    requestDate: 1625329200000,
    status: "Đã phê duyệt",
    filePath: [
      "https://via.placeholder.com/150/4",
      "https://via.placeholder.com/150/5",
    ],
  },
  {
    productId: "P003",
    productName: "Sản phẩm 3",
    manufactorName: "Nhà sản xuất C",
    requestDate: 1625415600000,
    status: "Bị từ chối",
    filePath: [
      "https://via.placeholder.com/150/6",
    ],
  },
  // Thêm nhiều dữ liệu hơn nếu cần
];

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const ManagerRequestTranningImage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleViewFiles = (files) => {
    setSelectedFiles(files);
    setModalIsOpen(true);
  };

  const handleDownloadFiles = (files) => {
    files.forEach((file, index) => {
      saveAs(file, `file_${index + 1}.jpg`);
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Bảng Yêu Cầu</h1> */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Tên Sản Phẩm</th>
            <th className="py-2">Nhà Sản Xuất</th>
            <th className="py-2">Ngày Yêu Cầu</th>
            {/* <th className="py-2">Trạng Thái</th> */}
            <th className="py-2">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((request, index) => (
            <tr key={index} className="text-center">
              <td className="py-2">{request.productName}</td>
              <td className="py-2">{request.manufactorName}</td>
              <td className="py-2">{formatDate(request.requestDate)}</td>
              {/* <td className="py-2">{request.status}</td> */}
              <td className="py-2 space-x-2">
                <button
                  onClick={() => handleViewFiles(request.filePath)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Xem ảnh"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDownloadFiles(request.filePath)}
                  className="text-green-500 hover:text-green-700"
                  title="Tải xuống tất cả ảnh"
                >
                  Tải xuống
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() =>
          dummyData.forEach((request) => handleDownloadFiles(request.filePath))
        }
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Tải xuống tất cả ảnh
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Hình ảnh"
        className="bg-white p-4 mx-auto my-12 max-w-lg rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-2">Hình ảnh</h2>
        <div className="flex flex-wrap justify-center space-x-2">
          {selectedFiles.map((file, index) => (
            <img
              key={index}
              src={file}
              alt={`File ${index + 1}`}
              className="w-32 h-32 object-cover m-2"
            />
          ))}
        </div>
        <button
          onClick={() => setModalIsOpen(false)}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Đóng
        </button>
      </Modal>
    </div>
  );
};

export default ManagerRequestTranningImage;
