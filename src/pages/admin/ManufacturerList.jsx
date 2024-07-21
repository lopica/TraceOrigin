import React, { useState, useEffect } from "react";
import { useGetUsersQuery, useLockUserMutation } from "../../store/apis/userApi";
import Pagination from "../../components/UI/Pagination";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "../../components/UI/userProfile";
import handleKeyDown from "../../utils/handleKeyDown";
import { useForm } from "react-hook-form";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { useGetAllDistinctCityQuery } from "../../store/apis/mapApi";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";

function VerifyManufacturer() {
  const navigate = useNavigate();
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    header: "",
    body: "",
    onConfirm: null,
  });

  const { handleSubmit, register, control } = useForm({
    mode: "onTouched",
    defaultValues: {
      nameSearch: "",
      citySearch: "",
      statusSearch: "",
    },
  });

  const { data: citiesData, isFetching: isFetchingCities } = useGetAllDistinctCityQuery();

  const [searchParams, setSearchParams] = useState({
    email: "",
    roleId: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    orderBy: "userId",
    isAsc: "true",
    page: page.toString(),
    size: "10",
    city: ""
  });

  const { data, isError, isFetching, refetch } = useGetUsersQuery(searchParams, {
    skip: !isAuthenticated
  });

  const [lockUser] = useLockUserMutation();

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (isError?.status === 401 && !isFetching) {
      console.log('vo error 401')
      navigate("/portal/login");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (!isFetching && !isAuthenticated) {
      console.log('vo timeout')
      getToast('Phiên đăng nhập đã hết hạn');
      navigate("/portal/login");
    }
  }, [isFetching, isAuthenticated, getToast, navigate]);

  useEffect(()=>{
    if (!isError && !isFetching) {
      if (data) {
        console.log(data)
        
      }
    }
  },[isError, isFetching])

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

  const statusMap = (user) => {
    const handleClick = () => handleStatusColumnClick(user);
    switch (user.status) {
      case 1:
        return (
          <span className="text-success cursor-pointer" onClick={handleClick}>
            &#8226; <Link to="#" className="text-success">Đã kích hoạt</Link>
          </span>
        );
      case 2:
        return (
          <span className="text-info">
            &#8226; <Link to="#" className="text-info">Đang xử lý</Link>
          </span>
        );
      default:
        return (
          <span className="text-secondary">
            &#8226; <Link to="#" className="text-secondary">Chưa kích hoạt</Link>
          </span>
        );
    }
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
            <td>{statusMap(user)}</td>
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

  const searchHandler = (data) => {
    setSearchParams({
      ...searchParams,
      email: data.emailSearch,
      city: data.citySearch.split(',')[0].trim(),
      status: data.statusSearch.split(',')[0].trim(),
      page: 0 
    });
  };

  const statusData = [
    { id: "1", content: "Active" },
    { id: "2", content: "Lock" },
    { id: "-1", content: "Inactive" }
  ];

  return (
    <div className="table-responsive p-5">
      <form
        className="flex items-end flex-col justify-between gap-2 mx-auto 
        md:flex-row md:justify-start md:gap-2 md:items-end"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(searchHandler)}
      >
        <Input
          label="Tên sản phẩm"
          {...register("nameSearch")}
          type="search"
          placeholder="Tên sản phẩm"
        />
        <Input
          label="Thành phố"
          type="select"
          control={control}
          {...register("citySearch")}
          data={citiesData?.map(city => ({id:city.text ,  content: city.text })) || []}
          placeholder="Chọn thành phố"
        />
        <Input
          label="Trạng thái"
          type="select"
          control={control}
          {...register("statusSearch")}
          data={statusData}
          placeholder="Chọn trạng thái"
        />
        <Button
          primary
          rounded
          className="whitespace-nowrap h-[5svh] w-full md:w-fit md:py-6 md:px-10"
        >
          Tìm kiếm
        </Button>
      </form>
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
