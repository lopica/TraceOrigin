import React, { useState, useEffect } from "react";
import { useGetUsersQuery, useLockUserMutation } from "../../store/apis/userApi";
import Pagination from "../../components/UI/Pagination";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link } from "react-router-dom";
import ProfileModal from "../../components/UI/userProfile";
import SortableTable from "../../components/SortableTable";

function VerifyManufacturer() {
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    header: "",
    body: "",
    onConfirm: null,
  });

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

  const [lockUser] = useLockUserMutation();

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

  const handleStatusColumnClick = (user) => {
    let headerContent = "";
    let modalContentBody = "";
    let confirmAction = null;

    if (user.status === 1) {
      headerContent = "Khóa Tài Khoản";
      modalContentBody = "Bạn có chắc muốn khóa tài khoản này?";
      confirmAction = () => handleLockUnlock(user.userId, 2);
    } else if (user.status === 2) {
      headerContent = "Mở Khóa Tài Khoản";
      modalContentBody = "Bạn có chắc muốn mở khóa tài khoản này?";
      confirmAction = () => handleLockUnlock(user.userId, 1);
    }

    setModalContent({
      header: headerContent,
      body: modalContentBody,
      onConfirm: confirmAction,
    });

    setIsConfirmationModalOpen(true);
  };

  const status0Msg = () => (
    <span>Bạn cần phê duyệt chứng chỉ để kích hoạt</span>
  );

  const status1Msg = () => (
    <span>Đang hoạt động, Click để khóa tài khoản</span>
  );

  const status2Msg = () => (
    <span>Tài khoản đang bị khóa, Click để mở khóa</span>
  );
  const statusMap = {
    default: (
        <span className="text-secondary">
          &#8226; <Link to="#" className="text-secondary">Chưa kích hoạt</Link>
        </span>
    ),
    1: (
        <span className="text-success cursor-pointer" onClick={() => handleStatusColumnClick(item)}>
          &#8226; <Link to="#" className="text-success">Đã kích hoạt</Link>
        </span>
    ),
    2: (
        <span className="text-info">
          &#8226; <Link to="#" className="text-info">Đang xử lý</Link>
        </span>
    )
  };
  
  const getStatusComponent = (status) => {
    return statusMap[status] || statusMap.default;
  };

  const handleLockUnlock = async (userId, status) => {
    setIsLoading(true);
    try {
      await lockUser({ userId: userId.toString(), status: status.toString() }).unwrap();
      refetch();
    } catch (error) {
      console.error("Lock/Unlock user error:", error);
    } finally {
      setIsLoading(false);
      setIsConfirmationModalOpen(false);
    }
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
            {getStatusComponent(user.status)}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <div className="table-responsive p-5">
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
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeModal}
        headerContent={modalContent.header}
        content={modalContent.body}
        onConfirm={modalContent.onConfirm}
        isLoading={isLoading}
      />
    </div>
  );
}

export default VerifyManufacturer;
