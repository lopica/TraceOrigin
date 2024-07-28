import React, { useEffect, useState } from "react";
import { FaCheck, FaHourglassHalf } from "react-icons/fa";
import { useSelector } from "react-redux";
import useToast from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const initialData = [
  {
    id: 1,
    phone: "0123456789",
    email: "example1@mail.com",
    name: "Nguyễn Văn A",
    reason: "Tư vấn sản phẩm",
    consulted: true,
    date: "2024-07-20", // Thêm dữ liệu ngày để kiểm tra
  },
  {
    id: 2,
    phone: "0987654321",
    email: "example2@mail.com",
    name: "Trần Thị B",
    reason: "Hỗ trợ kỹ thuật",
    consulted: false,
    date: "2024-07-25", // Thêm dữ liệu ngày để kiểm tra
  },
  // Thêm dữ liệu mẫu khác
];

function CustomerService() {
  const [searchKey, setSearchKey] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortType, setSortType] = useState("all");
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

  // Xử lý bộ lọc


  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="md:w-1/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <div className="mb-4">
          <label
            htmlFor="searchKey"
            className="block text-sm font-medium mb-1"
          >
            Tìm theo số điện thoại và email:
          </label>
          <input
            id="searchKey"
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
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
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-1/2"
            />
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="all">Tất cả</option>
            <option value="consulted">Đã tư vấn</option>
            <option value="notConsulted">Chưa tư vấn</option>
          </select>
        </div>
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
        </div>
      </div>

      <div className="md:w-3/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Danh sách khách hàng</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">#</th>
              <th className="border border-gray-300 p-2">Số điện thoại</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Tên</th>
              <th className="border border-gray-300 p-2">Lý do tư vấn</th>
              <th className="border border-gray-300 p-2">Trạng thái</th>
              <th className="border border-gray-300 p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">{item.id}</td>
                <td className="border border-gray-300 p-2">{item.phone}</td>
                <td className="border border-gray-300 p-2">{item.email}</td>
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">{item.reason}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <div
                    className={`p-2 flex items-center justify-center rounded-full ${
                      item.consulted ? "text-green-400" : "text-yellow-300"
                    }`}
                  >
                    {item.consulted ? <FaCheck /> : <FaHourglassHalf />}
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  {item.consulted ? (
                    <></>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onConfirm(item)}
                        className="bg-color1 text-white p-2 rounded hover:bg-color1Dark"
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
