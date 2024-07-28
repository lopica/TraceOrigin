import React, { useEffect, useState } from "react";
import { FaCheck, FaHourglassHalf } from "react-icons/fa"; // Import biểu tượng dấu tích
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
  },
  {
    id: 2,
    phone: "0987654321",
    email: "example2@mail.com",
    name: "Trần Thị B",
    reason: "Hỗ trợ kỹ thuật",
    consulted: false,
  },
  // Thêm dữ liệu mẫu khác
];

function CustomerService() {
  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [sortType, setSortType] = useState("all");
  const [data, setData] = useState(initialData);
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
  const filteredData = data.filter((item) => {
    return (
      (item.phone.includes(searchPhone) || item.name.includes(searchName)) &&
      (sortType === "all" ||
        (sortType === "consulted" && item.consulted) ||
        (sortType === "notConsulted" && !item.consulted))
    );
  });

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="md:w-1/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <div className="mb-4">
          <label
            htmlFor="phoneSearch"
            className="block text-sm font-medium mb-1"
          >
            Tìm theo số điện thoại:
          </label>
          <input
            id="phoneSearch"
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="nameSearch"
            className="block text-sm font-medium mb-1"
          >
            Tìm theo tên:
          </label>
          <input
            id="nameSearch"
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
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
            {filteredData.map((item) => (
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
