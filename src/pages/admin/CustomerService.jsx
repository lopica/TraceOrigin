import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaHourglassHalf,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
  FaStickyNote,
  FaTimesCircle,
  FaCheckCircle,
  
} from "react-icons/fa";

import { useSelector } from "react-redux";
import useToast from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  useCountStatusQuery,
  useSearchCustomerCareQuery,
  useUpdateStatusMutation,
} from "../../store/apis/customercareApi";
import Pagination from "../../components/UI/Pagination";
import CustomerCareInfo from "../../components/UI/monitoring/CustomerCareInfo";

function CustomerService() {
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(0);
  const [updateStatus] = useUpdateStatusMutation();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [note, setNote] = useState("");
  const { getToast } = useToast();
  const navigate = useNavigate();
  const [body, setBody] = useState({
    keyword: "",
    startDate: 0,
    endDate: 0,
    status: 3,
    pageNumber: 0,
    pageSize: 8,
    type: "",
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
  //=============== tooltip
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };
  //=============== handle update status
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
        console.log(updateStatusData + " gfgfgg");
        const result = await updateStatus(updateStatusData).unwrap();
        getToast("Cập nhật trạng thái thành công");
      } catch (error) {
        error;
      }
      setShouldFetch(true);
      refetch();
      refetchDataCount();
    }
  };

  const alertClass = errorMsg ? "block" : "hidden";

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

        {/* Khu vực ghi chú */}
        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-medium mb-1">
            Ghi chú:
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            rows="4"
          />
          <div className={`flex items-center mt-2 ${alertClass}`}>
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            <span className="text-yellow-500">
              Bạn cần ghi note trước khi bấm nút hành động
            </span>
          </div>
        </div>
      </div>

      <div className="md:w-3/4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Danh sách khách hàng</h2>
        <CustomerCareInfo done={2} cancel={2} waiting={3} />
      </div>
        <table className="min-w-full bg-white border text-xs  border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Tên khách hàng</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Số điện thoại</th>
              <th className="border border-gray-300 p-2">Nội dung</th>
              <th className="border border-gray-300 p-2">Thời gian</th>
              <th className="border border-gray-300 p-2">Trạng thái</th>
              <th className="border border-gray-300 p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((item, index) => (
              <tr key={item.careId}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  {item.customerName}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.customerEmail}
                </td>
                <td className="border border-gray-300 p-2">
                  {item.customerPhone}
                </td>
                <td className="border border-gray-300 p-2">{item.content}</td>
                <td className="border border-gray-300 p-2">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <div className="flex items-center justify-start space-x-2">
                    <div
                      className={`p-2 flex items-center justify-center rounded-full ${
                        item.status === 1 ? "text-green-400" : item.status === 2 ? "text-red-400" : "text-yellow-300"
                      }`}
                    >
                      {item.status === 1 ? <FaCheck /> : item.status === 2 ? <FaTimes />: <FaHourglassHalf />}
                    </div>
                    {item.note && (
                      <div className="relative inline-block">
                        <FaStickyNote
                          className="text-gray-500 cursor-pointer"
                          onClick={toggleTooltip}
                        />
                        <div
                          className={`tooltip absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-gray-700 text-white text-xs rounded py-1 px-2 transition-opacity duration-300 ease-in-out ${
                            isVisible ? "opacity-100" : "opacity-0"
                          } whitespace-nowrap max-w-48`}
                        >
                          {item.note}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  {item.status === 1 ? (
                    <></>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onConfirm(item.careId, 1)}
                        className="p-0.5 whitespace-nowrap rounded-full bg-green-500 hover:bg-green-400 text-white"
                      >
                        <FaCheckCircle size={24} />
                      </button>
                      <button
                        onClick={() => onConfirm(item.careId, 2)}
                        className="p-0.5 whitespace-nowrap rounded-full bg-red-500 hover:bg-red-400 text-white"
                      >
                        <FaTimesCircle size={24} />
                      </button>
                    </div>
                  )}
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
    </div>
  );
}

export default CustomerService;
