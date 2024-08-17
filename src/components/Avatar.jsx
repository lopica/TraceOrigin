import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/use-auth";
import useToast from "../hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { requireLogin, updateUser, useFetchUserQuery } from "../store";
import { userApi } from "../store/apis/userApi";
import ProfileModal from "../components/UI/userProfile";
import ChangePassword from "../components/UI/ChangePassword";
import { matchPath, useLocation } from "react-router-dom";

let avatar;
function Avatar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const hasRefetched = useRef(false);
  // const isFirstRun = useRef(true);
  const dispatch = useDispatch();
  const { data, isError, isFetching, error, isSuccess, refetch } =
    useFetchUserQuery(undefined, {
      skip: !isAuthenticated,
    });

  const user = useSelector((state) => state.userSlice);
  const { handleLogout: logout } = useAuth();
  const { getToast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  async function handleLogout() {
    localStorage.setItem("lastUserId", data.userId);
    await logout().then(() => {
      getToast("Đăng xuất thành công");
    });
  }

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(userApi.util.resetApiState());
  //     console.log("voday");
  //     refetch();
  //   }
  // }, [isAuthenticated, refetch, dispatch]);

  useEffect(() => {
    if (user?.userId) {
      // if (isFirstRun.current) {
      //   isFirstRun.current = false;
      //   return;
      // }
      const lastUserId = localStorage.getItem("lastUserId");
      if (lastUserId !== user.userId && !hasRefetched.current) {
        // console.log('vo day')
        refetch();
        hasRefetched.current = true; // Set the ref to prevent further refetches
      }
    }
  }, [user, refetch]);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      dispatch(updateUser(data));
    }
  }, [isSuccess, isFetching, dispatch]);

  useEffect(() => {
    if (isError && error.status === 401 && !isFetching) {
      console.log("vo day");
      dispatch(userApi.util.resetApiState());
      hasRefetched.current = true;
      // dispatch(requireLogin());
      if (matchPath("manufacturer/products/:productId/:itemId", currentPath)) dispatch(requireLogin());
    }
  }, [isError, error, dispatch]);

  const renderAvatar = (profileIMG, firstName) => {
    if (profileIMG) {
      return (
        <img
          src={profileIMG}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      );
    }

    const initial = firstName ? firstName.charAt(0).toUpperCase() : "U";
    return (
      <div className=" w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
        <span className="text-2xl">{initial}</span>
      </div>
    );
  };

  if (isFetching) {
    avatar = <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>;
  } else if (isError) {
    avatar = (
      <img
        alt="Error loading avatar"
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        className="w-10 h-10 rounded-full"
      />
    );
  } else {
    if (data) avatar = renderAvatar(user.profileImage, user.firstName);
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">{avatar}</div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <a
            className="justify-between"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleUserClick(user.userId);
            }}
          >
            Thông tin tài khoản
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpenChangePassword();
            }}
          >
            Đổi mật khẩu
          </a>
        </li>
        <li>
          <a onClick={handleLogout}>Đăng xuất</a>
        </li>
      </ul>
      {selectedUserId && (
        <ProfileModal
          userId={selectedUserId}
          closeModal={handleCloseModal}
          isEditable={true}
        />
      )}
      {isChangePasswordOpen && (
        <ChangePassword
          isOpen={isChangePasswordOpen}
          onClose={handleCloseChangePassword}
        />
      )}
    </div>
  );
}

export default Avatar;
