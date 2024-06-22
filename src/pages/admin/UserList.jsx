import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../store/apis/userApi";
import Pagination from "../../components/UI/Pagination";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link } from "react-router-dom";
import { Tooltip, Typography } from "@material-tailwind/react";
import ProfileModal from "../user/userProfile";

function UserList() {
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { data, isError, isFetching, refetch } = useGetUsersQuery({
    email: "",
    roleId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    orderBy: "userId",
    isAsc: "true",
    page: page.toString(),
    size: "10"
  });

  useEffect(() => {
    console.log("Fetching status:", isFetching);
    console.log("Error status:", isError);
    console.log("Fetched data:", data);
  }, [isFetching, isError, data]);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  const status0Msg = () =>{
    return(
      <span>Bạn cần phê duyệt chứng chỉ để kích hoạt</span>
    );
  };
  const status1Msg = () =>{
    return(
      <span>Đang hoạt động, Click để khóa tài khoản</span>
    );
  };
  const status2Msg = () =>{
    return(
      <span>Tài khoản đang bị khóa, Click để mở khóa</span>
    );
  };

  const renderTableBody = () => {
    if (isFetching) {
      return (
        <tbody>
          <tr>
            <td colSpan="5" className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </td>
          </tr>
        </tbody>
      );
    }

    if (isError) {
      return (
        <tbody>
          <tr>
            <td colSpan="5" className="text-center text-red-500">
              Error fetching data.
            </td>
          </tr>
        </tbody>
      );
    }

    const users = data?.content || [];
    return (
      <tbody>
        {users.map((user, index) => (
          <tr key={user.userId} className="hover">
            <td>{index + 1 + page * 10}</td>
            <td>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleUserClick(user.userId);
                }}
              >
                {user.name}
              </a>
            </td>
            <td>{user.email}</td>
            <td>{user.city}</td>
            <td>
              {user.status === 0 && (
                <Tooltip content={status0Msg} open="true">
                  <span className="text-secondary">
                    &#8226; <Link to="#" className="text-secondary">Chưa kích hoạt</Link>
                  </span>
                </Tooltip>
              )}
              {user.status === 1 && (
                <Tooltip content={status1Msg} open="true">
                  <span className="text-success">
                    &#8226; <Link to="#" className="text-success">Đã kích hoạt</Link>
                  </span>
                </Tooltip>
              )}
              {user.status === 2 && (
                <Tooltip  className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                content={
                  <div className="w-80">
                    <Typography color="blue-gray" className="font-medium">
                      Material Tailwind
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal opacity-80"
                    >
                      Material Tailwind is an easy to use components library for Tailwind
                      CSS and Material Design.
                    </Typography>
                  </div>
                }>
                  <span className="text-error">
                    &#8226; <Link to="#" className="text-error">Đang khóa</Link>
                  </span>
                </Tooltip>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch(); // Manually refetch data when page changes
  };

  return (
    <div className="table-responsive">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Thành Phố</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        {renderTableBody()}
      </table>
      <div className="flex justify-end mt-4">
        <Pagination
          active={page}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
        />
      </div>
      {selectedUserId && (
        <ProfileModal userId={selectedUserId} closeModal={handleCloseModal} />
      )}
    </div>
  );
}

export default UserList;
