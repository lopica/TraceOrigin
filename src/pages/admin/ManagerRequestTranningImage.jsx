import React, { useState } from "react";
import Modal from "react-modal";
import { FaEye, FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import Carousel from "../../components/UI/Carousel";

const dummyData = [
  {
    productId: "P001",
    productName: "Sản phẩm 1",
    manufactorName: "Nhà sản xuất A",
    requestDate: 1625242800000,
    status: "Đang chờ xử lý",
    filePath: [
      "https://www.sweelee.com.vn/cdn/shop/products/products_2FF03-233-0204-900_2FF03-233-0204-900_1573456261840_600x600.jpg?v=1608265965",
      "https://i.ytimg.com/vi/gVaChmhUTdQ/maxresdefault.jpg"
    ],
  },
  {
    productId: "P002",
    productName: "Sản phẩm 2",
    manufactorName: "Nhà sản xuất B",
    requestDate: 1625329200000,
    status: "Đã phê duyệt",
    filePath: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvkvhFpeXxHd-oBSRKUcnx3eg7Bzn1mk7QefyP-fQD5oOTiYfpj0n1deWhT8VwimASQVI&usqp=CAU",
      "https://i.ytimg.com/vi/DQyT9I4Pm8Y/sddefault.jpg",
    ],
  },
  // Thêm nhiều dữ liệu hơn nếu cần
];

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const ManagerRequestTranningImage = () => {
  const [slides, setSlides] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  // Các state để lưu thông tin filter
  const [filter, setFilter] = useState({
    orderBy: "productId",
    productName: "",
    manufactorName: "",
    isDesc: false,
  });

  const handleViewFiles = (files) => {
    const images = files.map((file) => file);
    setSlides(images.map((image, idx) => (
      <img src={image} alt={`slide_${idx}`} className="" key={idx} />
    )));
    setModalIsOpen(true);
  };

  const handleDownloadFiles = async (files, productName, manufactorName) => {
    const zip = new JSZip();
    const folder = zip.folder(`${productName}-${manufactorName}`);

    for (let i = 0; i < files.length; i++) {
      try {
        const response = await fetch(files[i]);
        if (!response.ok) throw new Error(`Failed to fetch ${files[i]}`);
        const blob = await response.blob();
        folder.file(`file_${i + 1}.jpg`, blob);
      } catch (error) {
        // console.error(error.message);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${productName}-${manufactorName}.zip`);
    });
  };

  const handleDownloadAllFiles = async () => {
    const zip = new JSZip();

    for (const request of dummyData) {
      const folder = zip.folder(`${request.productName}-${request.manufactorName}`);
      
      for (let i = 0; i < request.filePath.length; i++) {
        try {
          const response = await fetch(request.filePath[i]);
          if (!response.ok) throw new Error(`Failed to fetch ${request.filePath[i]}`);
          const blob = await response.blob();
          folder.file(`file_${i + 1}.jpg`, blob);
        } catch (error) {
          console.error(error.message);
        }
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "all_products.zip");
    });
  };

  // Hàm xử lý khi thay đổi thông tin filter
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter({
      ...filter,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-2xl font-bold mb-6">Bảng Yêu Cầu</h1> */}

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="productName" className="block font-medium mb-1">Tên sản phẩm</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={filter.productName}
              onChange={handleFilterChange}
              className="input input-bordered w-full"
              placeholder="Tìm theo tên sản phẩm"
            />
          </div>
          <div>
            <label htmlFor="manufactorName" className="block font-medium mb-1">Nhà sản xuất</label>
            <input
              type="text"
              id="manufactorName"
              name="manufactorName"
              value={filter.manufactorName}
              onChange={handleFilterChange}
              className="input input-bordered w-full"
              placeholder="Tìm theo nhà sản xuất"
            />
          </div>
          <div>
            <label htmlFor="orderBy" className="block font-medium mb-1">Sắp xếp theo</label>
            <select
              id="orderBy"
              name="orderBy"
              value={filter.orderBy}
              onChange={handleFilterChange}
              className="select select-bordered w-full"
            >
              <option value="productId">Mã sản phẩm</option>
              <option value="productName">Tên sản phẩm</option>
              <option value="manufactorName">Nhà sản xuất</option>
              <option value="requestDate">Ngày yêu cầu</option>
            </select>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="isDesc"
            name="isDesc"
            checked={filter.isDesc}
            onChange={handleFilterChange}
            className="checkbox"
          />
          <label htmlFor="isDesc" className="font-medium ml-2">Sắp xếp giảm dần</label>
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 font-semibold text-left">Tên Sản Phẩm</th>
            <th className="py-2 px-4 font-semibold text-left">Nhà Sản Xuất</th>
            <th className="py-2 px-4 font-semibold text-left">Ngày Yêu Cầu</th>
            <th className="py-2 px-4 font-semibold">Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((request, index) => (
            <tr key={index} className="text-center border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-left">{request.productName}</td>
              <td className="py-2 px-4 text-left">{request.manufactorName}</td>
              <td className="py-2 px-4 text-left">{formatDate(request.requestDate)}</td>
              <td className="py-2 px-4 space-x-2 flex justify-center">
                <button
                  onClick={() => handleViewFiles(request.filePath)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Xem ảnh"
                >
                  <FaEye size={18} />
                </button>
                <button
                  onClick={() => handleDownloadFiles(request.filePath, request.productName, request.manufactorName)}
                  className="text-green-500 hover:text-green-700"
                  title="Tải xuống tất cả ảnh"
                >
                  <FaDownload size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleDownloadAllFiles}
        className="mt-4 btn btn-primary"
      >
        Tải xuống tất cả ảnh
      </button>

      <Modal
  isOpen={modalIsOpen}
  onRequestClose={() => setModalIsOpen(false)}
  contentLabel="Hình ảnh"
  className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
  overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
>
  <button
    onClick={() => setModalIsOpen(false)}
    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
  >
    X
  </button>
  <Carousel slides={slides} />
</Modal>
    </div>
  );
};

export default ManagerRequestTranningImage;
