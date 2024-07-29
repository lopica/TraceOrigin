import React, { useEffect, useState } from "react";
import { FaCheck, FaHourglassHalf, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { useSelector } from "react-redux";
import useToast from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSearchCustomerCareQuery, useUpdateStatusMutation } from "../../store/apis/customercareApi";

function CustomerService() {
  const [updateStatus] = useUpdateStatusMutation();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [body, setBody] = useState({
    keyword: "",
    startDate: 0,
    endDate: 0,
    status: 0,
    pageNumber: 0,
    pageSize: 10,
    type: "",
  });

  const handleChange = (e) => {
    if (shouldFetch) {
      refetch();
      setShouldFetch(false);
    }
    const { name, value } = e.target;

    let convertedValue = value;
    if (name === 'startDate' || name === 'endDate') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        convertedValue = date.getTime();
      } else {
        console.warn('Invalid date format:', value);
      }
    }
    if (name === 'status') {
      if (value === '0') {
        convertedValue = "";
      } else if (value === '1') {
        convertedValue = "1";
      } else if (value === '2') {
        convertedValue = "0";
      } else {
        console.warn('Invalid status value:', value);
      }
    }

    setBody((prevData) => ({ ...prevData, [name]: convertedValue }));
  };

  const { data, error, isLoading, refetch, isSuccess } = useSearchCustomerCareQuery(body, {
    skip: !shouldFetch,
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString();
  };

  const [note, setNote] = useState("");
  const { getToast } = useToast();
  const navigate = useNavigate();

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
  };
  //=============== handle update status
  const onConfirmDone = async (careId) => {
    try {
      const updateStatusData = {
        careId: careId,   
        status: 1,         
        note: note
      };
      const result = await updateStatus(updateStatusData).unwrap(); 
      getToast("Cập nhật trạng thái thành công");
    } catch (error) {
      getToast("Lỗi cập nhật trạng thái");
    } 
    setShouldFetch(true);
    refetch();
   };
  const buttonClass = note ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white";
  const alertClass = note ? "block" : "hidden";

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="md:w-1/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="searchKey" className="block text-sm font-medium mb-1">
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
            <label htmlFor="dateRange" className="block text-sm font-medium mb-1">
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
            <label htmlFor="sortType" className="block text-sm font-medium mb-1">
              Sắp xếp theo:
            </label>
            <select
              id="sortType"
              name="status"
              value={body.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value={0}>Tất cả</option>
              <option value={1}>Đã tư vấn</option>
              <option value={2}>Chưa tư vấn</option>
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
            <span className="text-yellow-500">Ấn vào nút hoạt động để ghi note</span>
          </div>
        </div>
      </div>

      <div className="md:w-3/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Danh sách khách hàng</h2>
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
                <td className="border border-gray-300 p-2">{item.customerName}</td>
                <td className="border border-gray-300 p-2">{item.customerEmail}</td>
                <td className="border border-gray-300 p-2">{item.customerPhone}</td>
                <td className="border border-gray-300 p-2">{item.content}</td>
                <td className="border border-gray-300 p-2">{formatTimestamp(item.timestamp)}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <div
                    className={`p-2 flex items-center justify-center rounded-full ${
                      item.status === 1 ? "text-green-400" : "text-yellow-300"
                    }`}
                  >
                    {item.status === 1 ? <FaCheck /> : <FaHourglassHalf />}
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  {item.status === 1 ? (
                    <></>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onConfirmDone(item.careId)}
                        className={`p-2 rounded  ${note ? "bg-yellow-500 text-white hover:bg-yellow-400" : "bg-green-500 hover:bg-green-400 text-white"}`}
                      >
                        đã tư vấn
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerService;
