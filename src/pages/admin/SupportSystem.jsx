import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Pagination from "../../components/UI/Pagination";
import SupportList from "../../components/UI/supportSystem/SupportList";
import SupportModal from "../../components/UI/supportSystem/SupportModal";
import { useListAllBySupporterQuery, useReplyBySupporterMutation } from "../../store/apis/supportSystemApi";
import useToast from "../../hooks/use-toast";
import SupportListForAdmin from "../../components/UI/supportSystem/SupportListForAdmin";
import { useSelector } from "react-redux";
import { FaCheckCircle,FaRegEye, FaTimesCircle, FaSearch, FaHourglassHalf } from 'react-icons/fa';

function SupportSystem() {
  const [body, setBody] = useState({
    "keyword": "",
    "startDate": 0,
    "endDate": 0,
    "status": 3,
    "pageNumber": 0,
    "pageSize": 6,
    "type": "desc"
  });
  const { getToast } = useToast();
  const [shouldFetch, setShouldFetch] = useState(true);
  // const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data, error, isLoading, refetch, isSuccess  } = useListAllBySupporterQuery(body, {
    skip: !shouldFetch,
  });
  const [replyBySupporter] = useReplyBySupporterMutation();
  const [page, setPage] = useState(0);
    // =============================== handle logout
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.authSlice);
  
    useEffect(() => {
      if (!isAuthenticated) {
        getToast("Phiên đăng nhập đã hết hạn");
        navigate("/portal/login");
      }
    }, [isAuthenticated, getToast, navigate]);
      // =============================== 
  const handleSubmit = async (formData) => {
    getToast("Hệ thống đang xử lý");
    try {
      const base64Prefix = 'data:image/png;base64,';
      const cleanedImages = formData?.images.map(image =>
        image.startsWith(base64Prefix) ? image.replace(base64Prefix, '') : image
      );

      const replyBySupporterData = {
        id: formData.supportSystemId.value,
        content: formData.content,
        images: cleanedImages ? cleanedImages: []
      };
      const result = await replyBySupporter(replyBySupporterData).unwrap();
      getToast("Phản hồi khách hàng thành công");
    } catch (error) {
      console.error(error);
    }
    setShouldFetch(true);
    refetch();
  };
  // ============================paging
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setBody((prevData) => ({ ...prevData, pageNumber: newPage }));
  };
    // ============================handle form search

  const handleChange = (e) => {
    if (shouldFetch) {
      // refetch();
      setShouldFetch(false);
    }
    const { name, value } = e.target;

    let convertedValue = value;
    if (name === "startDate" || name === "endDate") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        convertedValue = date.getTime();
      } else {
        console.warn("Invalid date format:", value);
      }
    }

    setBody((prevData) => ({ ...prevData, [name]: convertedValue }));
  };


  const handleSearch = () => {
    setShouldFetch(true);
    refetch();
    refetchDataCount();
  };
      // ============================

  return (
    <div className="flex flex-col md:flex-row p-4">
<div className="md:w-1/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="searchKey"
              className="block text-sm font-medium mb-1"
            >
              Tìm theo số điện thoại và email:
            </label>
            <input
              id="searchKey"
              name="keyword"
              type="text"
              value={body.keyword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dateRange"
              className="block text-sm font-medium mb-1"
            >
              Tìm theo khoảng thời gian:
            </label>
            <div className="flex space-x-2">
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={body.startDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-1/2"
              />
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={body.endDate}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-1/2"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="sortType"
              className="block text-sm font-medium mb-1"
            >
              Sắp xếp theo:
            </label>
            <div className="flex space-x-2">
            <select
              id="sortType"
              name="status"
              value={body.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value={3}>Tất cả</option>
              <option value={1}>Đã xử lý</option>
              <option value={0}>Chưa xử lý</option>
            </select>
            <select
              id="type"
              name="type"
              value={body.type}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value={"desc"}>Mới nhất</option>
              <option value={"acs"}>Cũ nhất</option>

            </select>
            </div>
          </div>
          <div className="mb-4">
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center w-full px-4 py-2 bg-color1 text-white rounded-md hover:bg-color1Dark"
            >
              <FaSearch className="mr-2" />
              Tìm kiếm
            </button>
          </div>
        </form>

        
      </div>
      <div className="md:w-3/4 p-4">

  <SupportListForAdmin items={data?.content} onSubmit={handleSubmit} />
  <div className="flex justify-end mt-4">
          <Pagination
            active={page}
            totalPages={data?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
  </div>


    {/*================================== modal add ticket */}

</div>
  );
}

export default SupportSystem;
