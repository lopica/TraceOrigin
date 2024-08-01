import React, { useEffect, useState } from "react";

import { FaCheckCircle,FaRegEye, FaTimesCircle, FaSearch, FaHourglassHalf } from 'react-icons/fa';

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCountStatusQuery,
  useSearchCustomerCareQuery,
} from "../../store/apis/customercareApi";
import Pagination from "../../components/UI/Pagination";
import CustomerCareInfo from "../../components/UI/monitoring/CustomerCareInfo";
import PopupCustomerCare from "../../components/UI/monitoring/PopupCustomerCare";
import useToast from "../../hooks/use-toast";

function CustomerService() {
  const { getToast } = useToast();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // To control popup visibility
  const [dataSelected, setDataSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(true);
  const navigate = useNavigate();
  const [body, setBody] = useState({
    keyword: "",
    startDate: 0,
    endDate: 0,
    status: 3,
    pageNumber: 0,
    pageSize: 8,
    type: "desc",
  });
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setBody((prevData) => ({ ...prevData, pageNumber: newPage }));
  };

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

  const { data, error, isLoading, refetch, isSuccess } =
    useSearchCustomerCareQuery(body, {
      skip: !shouldFetch,
    });
    const { data: dataCount, refetch: refetchDataCount } =
    useCountStatusQuery({
      skip: !shouldFetch,
    });


  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString();
  };

  const { isAuthenticated } = useSelector((state) => state.authSlice);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated, getToast, navigate]);

  const handleSearch = () => {
    setShouldFetch(true);
    refetch();
    refetchDataCount();
  };
  //=============== handle update status
  

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const openPopup = (item) => {
    setDataSelected(item);
    setIsPopupOpen(true);
  };

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
              <option value={1}>Đã tư vấn</option>
              <option value={0}>Chưa tư vấn</option>
              <option value={2}>Tư vấn không thành công</option>
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Danh sách khách hàng</h2>
        <CustomerCareInfo done={dataCount?.cancel} cancel={dataCount?.waiting} waiting={dataCount?.done} />
      </div>
      <table className="min-w-full bg-white border border-gray-200 text-xs">
          <thead>
            <tr >
              <th className="p-2 border-b">#</th>
              <th className="p-6 border-b">Tên khách hàng</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Số điện thoại</th>
              <th className="p-4 border-b">Nội dung</th>
              <th className="p-4 border-b">Thời gian</th>
              <th className="border-b">Trạng thái</th>
              <th className="p-2 border-b">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((item, index) => (
              <tr className="border-b" key={item.careId}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  {item.customerName}
                </td>
                <td className="p-2">
                  {item.customerEmail}
                </td>
                <td className="p-2">
                  {item.customerPhone}
                </td>
                <td className="p-2">{item.content}</td>
                <td className="p-2">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className=" p-2 text-center">
                  <div className="flex text-center items-center justify-center">
                    <div
                      className={`p-2 ${
                        item.status === 1 ? "text-green-400" : item.status === 2 ? "text-red-400" : "text-yellow-300"
                      }`}
                    >
                      {item.status === 1 ? <FaCheckCircle /> : item.status === 2 ? <FaTimesCircle />: <FaHourglassHalf />}
                    </div>
                  
                  </div>
                </td>
                <td className="p-2">   
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openPopup(item)}
                        className="p-0 whitespace-nowrap rounded-full text-blue-500 hover:text-blue-400 "
                      >
                        <FaRegEye size={24} />
                      </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* paging */}
        <div className="flex justify-end mt-4">
          <Pagination
            active={page}
            totalPages={data?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <PopupCustomerCare
        isOpen={isPopupOpen}
        onClose={closePopup}
        refetch={handleSearch}
        item={dataSelected}
      />
    </div>
  );
}

export default CustomerService;
