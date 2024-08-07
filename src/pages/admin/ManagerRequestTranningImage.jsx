import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaEye, FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import Carousel from "../../components/UI/Carousel";
import { useGetimageRequestQuery, useApprovalImageRequestMutation } from "../../store/apis/productApi";
import Pagination from "../../components/UI/Pagination";
import { useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const ManagerRequestTranningImage = () => {
  const [slides, setSlides] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [approvalImageRequest] = useApprovalImageRequestMutation();
  const { getToast } = useToast();



  const [filter, setFilter, error] = useState({
    orderBy: "productId",
    productName: "",
    manufactorName: "",
    isDesc: false,
    page: 0,
    size: 10,
  });

  const { isAuthenticated } = useSelector((state) => state.authSlice);
  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);
  
  const { data, refetch } = useGetimageRequestQuery(filter);

  // useEffect(() => {
  //   refetch();
  // }, [filter]);

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
        console.error(error.message);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${productName}-${manufactorName}.zip`);
    });
  };

  const handleApproval = async (productId) => {
    try {
      await approvalImageRequest({
        type: 2,
        productId: [productId]
      }).unwrap();
      alert("Image request approved successfully.");
      refetch();
    } catch (error) {
      console.error("Error approving image request:", error);
    }
  };

  const handleDownloadAllFiles = async () => {
    const zip = new JSZip();

    for (const request of data.content || []) {
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

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter({
      ...filter,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearch = () => {
    setPage(0);
    refetch();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setFilter({
      ...filter,
      page: newPage,
    });
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tìm kiếm</h2>
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
              <option value="requestScanDate">Ngày yêu cầu</option>
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
        <div className="mt-4 flex justify-end">
          <button onClick={handleSearch} className="btn btn-success text-white">Tìm kiếm</button>
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
          {data?.content?.map((request, index) => (
            <tr key={index} className="text-center border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-left">{request.productName}</td>
              <td className="py-2 px-4 text-left">{request.manufactorName}</td>
              <td className="py-2 px-4">{formatDate(request.requestDate)}</td>
              <td className="py-2 px-4 flex justify-center space-x-2">
                <button
                  onClick={() => handleViewFiles(request.filePath)}
                  className="btn btn-primary text-white btn-xs"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDownloadFiles(request.filePath, request.productName, request.manufactorName)}
                  className="btn btn-success text-white btn-xs"
                >
                  <FaDownload />
                </button>
                <button
                  onClick={() => handleApproval(request.productId)}
                  className="btn btn-info text-white btn-xs"
                >
                  Phê Duyệt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleDownloadAllFiles}
          className="btn btn-warning"
        >
          Tải Xuống Tất Cả
        </button>
        <Pagination
          currentPage={page}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Image Viewer"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80%'
          },
        }}
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="btn btn-danger absolute top-2 right-2"
        >
          x
        </button>
        <Carousel slides={slides} />
      </Modal>
    </div>
  );
};

export default ManagerRequestTranningImage;
