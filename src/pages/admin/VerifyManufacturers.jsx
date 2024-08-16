import React, { useState, useEffect } from 'react';
import { useGetUsersQuery } from '../../store/apis/userApi';
import ProfileModal from '../../components/UI/userProfile';
import CarouselModal from '../../components/UI/CarouselModal';
import Pagination from '../../components/UI/Pagination';
import { useUpdateStatusMutation } from "../../store/apis/userApi";
import {  useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";
import { FaExclamationTriangle, } from "react-icons/fa";

function VerifyManufacturer() {
  const navigate = useNavigate();
  const { getToast } = useToast();
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  const [isModalOpenProfile, setModalOpenProfile] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.authSlice);



  const { data, isError, isFetching, refetch } = useGetUsersQuery({
    email: "",
    roleId: "",
    status: "8",
    dateFrom: "",
    dateTo: "",
    orderBy: "createAt",
    isAsc: "true",
    page: page.toString(),
    size: "10"
  });



  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (isError?.status === 401) {
      navigate("/portal/login");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!isFetching && !isAuthenticated) {
      getToast('Phiên đăng nhập đã hết hạn');
      navigate("/portal/login");
    }
  }, [isFetching, isAuthenticated, getToast, navigate]);

  const [updateStatus] = useUpdateStatusMutation();

  const handleOpenModalImage = (userId) => {
    setSelectedUserId(userId);
    setModalOpenImage(true);
  };

  const handleCloseModalImage = () => {
    setModalOpenImage(false);
  };

  const handleOpenModalProfile = (userId) => {
    setSelectedUserId(userId);
    setModalOpenProfile(true);
  };

  const handleCloseModalProfile = () => {
    setModalOpenProfile(false);
    setSelectedUserId(null);
  };

  const handleAccept = async (userId) => {
    await updateStatus({ id: userId, status: 1 });
    handleCloseModalImage();
    refetch();
  };

  const handleReject = async (userId) => {
    await updateStatus({ id: userId, status: 7 });
    handleCloseModalImage();
    refetch();
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
        {users.map((user) => (
          <tr key={user.userId} className="hover">
            <td>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenModalProfile(user.userId);
                }}
              >
                {user.name}
              </a>
            </td>
            <td>{user.email}</td>
            <td>{user.city}</td>
            <td className="center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenModalImage(user.userId);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/>
                </svg>
              </a>
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

  return (
    <div className="table-responsive p-5">
        {data?.content.length === 0 ? 
      (<div className="flex flex-col items-center text-center justify-center h-[73vh]">
      <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
        <h2 className="text-xl font-bold mb-4">Không có yêu cầu xác minh</h2>
        <p className="text-gray-600">
        Hiện tại hệ thống không nhận được bất kì thông báo nào cho việt xác minh nhà sản xuất.
        </p>
      </div>)
    :(
      <table className="table table-zebra mt-4 min-w-full bg-white border border-gray-100 text-xs">
        <thead className="text-black">
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Thành phố</th>
            <th>Xem chứng chỉ</th>
          </tr>
        </thead>
        {renderTableBody()}
      </table>
    )}
      <div className="flex justify-end mt-4">
        <Pagination
          active={page}
          totalPages={data?.totalPages || 0}
          onPageChange={handlePageChange}
        />
      </div>
      {isModalOpenProfile && (
        <ProfileModal userId={selectedUserId} closeModal={handleCloseModalProfile} isEditable = {false}/>
      )}
      {isModalOpenImage && (
        <CarouselModal
          isOpen={isModalOpenImage}
          onClose={handleCloseModalImage}
          userId={selectedUserId}
          onAccept={handleAccept}
          onReject={handleReject}
          isAdmin={true}
        />
      )}
    </div>
  );
}

export default VerifyManufacturer;
