import React, { useState, useEffect } from "react";
import { useGetUsersQuery, useLockUserMutation } from "../../store/apis/userApi";
import Pagination from "../../components/UI/Pagination";
import ConfirmationModal from "../../components/UI/ConfirmModal";
import { Link } from "react-router-dom";
import { Tooltip, Typography } from "@material-tailwind/react";
import ProfileModal from "../user/userProfile";
import SortableTable from "../../components/SortableTable";

function UserList() {
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

  const status0Msg = "Bạn cần phê duyệt chứng chỉ để kích hoạt";
  const status1Msg = "Đang hoạt động, Click để khóa tài khoản";
  const status2Msg = "Tài khoản đang bị khóa, Click để mở khóa";

  const getStatusColumnContent = (item) => {
    const statusMap = {
      0: (
        <Tooltip content={status0Msg}>
          <span className="text-secondary">
            &#8226; <Link to="#" className="text-secondary">Chưa kích hoạt</Link>
          </span>
        </Tooltip>
      ),
      1: (
        <Tooltip content={status1Msg}>
          <span className="text-success cursor-pointer" onClick={() => handleStatusColumnClick(item)}>
            &#8226; <Link to="#" className="text-success">Đã kích hoạt</Link>
          </span>
        </Tooltip>
      ),
      2: (
        <Tooltip
          className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
          content={
            <div className="w-80">
              <Typography color="blue-gray" className="font-medium">
                Material Tailwind
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal opacity-80">
                Material Tailwind is an easy to use components library for Tailwind CSS and Material Design.
              </Typography>
            </div>
          }
        >
          <span className="text-error cursor-pointer" onClick={() => handleStatusColumnClick(item)}>
            &#8226; <Link to="#" className="text-error">Đang khóa</Link>
          </span>
        </Tooltip>
      )
    };
  
    return statusMap[item.status];
  };

  

  let items;
  if (isFetching) {
    items = <div className="skeleton h-40 w-full"></div>;
  } else if (isError) {
    items = (
      <div className="text-center text-red-500">
        Error fetching data.
      </div>
    );
  } else {
    const config = [
      // {
      //   label: "#",
      //   render:  (item, index) => index + 1
      // },
      {
        label: "Tên",
        render: (item) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleUserClick(item.userId);
            }}
          >
            {item.name}
          </a>
        )
      },
      {
        label: "Email",
        render: (item) => item.email
      },
      {
        label: "Thành Phố",
        render: (item) => item.city
      },
      {
        label: "Trạng thái",
        render: (item) => getStatusColumnContent(item),
        sortValue: (item) => item?.status,
      },
    ];

    const keyFn = (item) => item.userId;

    items = (
      <div className="w-full">
        <SortableTable data={data.content} config={config} keyFn={keyFn} />
      </div>
    );
  }

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };

  const closeModal = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <div className="table-responsive">
      {items}
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

export default UserList;
