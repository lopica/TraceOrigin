import { useSelector } from "react-redux";
import useUser from "../hooks/use-user";
import useAuth from "../hooks/use-auth";
import useToast from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/UI/userProfile";
import ChangePassword from "../components/UI/ChangePassword";
import React, { useEffect, useState } from "react";

let avatar;
function Avatar() {
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { isFetching, isError, refetch } = useUser();
  const user = useSelector((state) => state.userSlice);
  const { handleLogout: logout } = useAuth();
  const { getToast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  async function handleLogout() {
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

  useEffect(() => {
    if (isAuthenticated) refetch();
  }, [isAuthenticated]);

  if (isFetching) {
    avatar = <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>;
  } else if (isError) {
    avatar = (
      <img
        alt="Tailwind CSS Navbar component"
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
      />
    );
  } else {
    if (user.profileImage) {
      avatar = <img alt="default avatar" src={user.profileImage} />;
    } else {
      avatar = <img alt="default avatar" src="/default_avatar.png" />;
    }
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
            Profile
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
            Change Password
          </a>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
      {selectedUserId && (
        <ProfileModal userId={selectedUserId} closeModal={handleCloseModal} />
      )}
      {isChangePasswordOpen && (
        <ChangePassword isOpen={isChangePasswordOpen} onClose={handleCloseChangePassword} />
      )}
    </div>
  );
}

export default Avatar;
