import React, { useState, useEffect } from "react";
import { useListAllBySupporterQuery } from "../../store/apis/supportSystemApi";
import {
  useDeleteSupporterMutation,
  useListAllCustomerSupportQuery,
} from "../../store/apis/userApi";
import { FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import AddSupporterModal from "../../components/UI/supportSystem/AddSupporterModal";
import { useSignupForCustomerSupportMutation } from "../../store/apis/authApi";
import useToast from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { parseJSON } from "date-fns";
import ConfirmDeleteModal from "../../components/UI/supportSystem/ConfirmationDialog";

function CustomerSupportList() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [body, setBody] = useState({
    email: "",
    pageNumber: 0,
    pageSize: 6,
    type: "",
  });
  const { getToast } = useToast();

  const [signupForCustomerSupport] = useSignupForCustomerSupportMutation();
  const [deleteSupporter] = useDeleteSupporterMutation();

  const { data, error, isLoading, refetch, isSuccess } =
    useListAllCustomerSupportQuery(body, {
      skip: !shouldFetch,
    });
  // =============================== handle logout
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated, getToast, navigate]);
  // ==================================== handle onchange
  const handleChange = (e) => {
    if (shouldFetch) {
      setShouldFetch(false);
    }
    const { name, value } = e.target;
    let convertedValue = value;

    setBody((prevData) => ({ ...prevData, [name]: convertedValue }));
  };
  // ==================================== handle search

  const handleSearch = () => {
    setShouldFetch(true);
    refetch();
  };
  // ==================================== handle add

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => setModalIsOpen(false);

  const handleSubmit = async (formData) => {
    getToast("Hệ thống đang xử lý");
    try {
      console.log(formData);
      const result = await signupForCustomerSupport(formData).unwrap();
    } catch (error) {
      if (error.originalStatus != 200) {
        if (error.data == "email already exists") {
          getToast("Email đã tồn tại");
        } else {
          getToast("Đã xảy ra lỗi khi tạo tài khoản");
        }
      } else {
        getToast("Tạo tài khoảng thành công");
      }
    }

    setShouldFetch(true);
    refetch();
  };
  // ==================================== handle delete
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const handleDelete = async () => {
    getToast("Hệ thống đang xử lý");
    try {
      const deleteData = {
        id: deleteId,
      };
      const result = await deleteSupporter(deleteData).unwrap();
    } catch (error) {
      if (error.originalStatus != 200) {
        getToast("Đã xảy ra lỗi khi xoá tài khoản");
      }else{
        getToast("Xoá tài khoản thành công");
      }
    }
    setShouldFetch(true);
    refetch();
    setShowConfirm(false); // Close the modal after deletion
  };
  const openConfirmModal = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  return (
    <div className="flex flex-col md:flex-row p-4">
      {/* ======================================= list filter  */}
      <div className="md:w-1/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="searchKey"
              className="block text-sm font-medium mb-1"
            >
              Tìm theo email:
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={body.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
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
       {/* ======================================= list supporter  */}
      <div className="md:w-3/4 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold mb-4">Danh sách tài khoản</h2>
          <button
            onClick={openModal}
            className="add-button flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <FaPlus className="mr-2" /> Thêm tài khoản hỗ trợ
          </button>
          <AddSupporterModal
            isOpen={modalIsOpen}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        </div>
        <table className="table table-zebra mt-4 min-w-full bg-white border border-gray-100 text-xs">
          <thead className="text-black">
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map((item, index) => (
              <tr className="border-b" key={item.userId}>
                <td>{item.userId}</td>
                <td>
                  {item.lastName} {item.firstName}
                </td>
                <td>{item.email}</td>
                <td>{item.phone}</td>

                <td>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openConfirmModal(item.userId)}
                      className="p-0 whitespace-nowrap rounded-full text-red-500 hover:text-red-400"
                    >
                      <FaTrashAlt size={24} />
                    </button>
                    <ConfirmDeleteModal
                      show={showConfirm}
                      onClose={() => setShowConfirm(false)}
                      onConfirm={handleDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerSupportList;
