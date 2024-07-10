import { useSelector } from "react-redux";
import useUser from "../hooks/use-user";
import useAuth from "../hooks/use-auth";
import useToast from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

let avatar;
function Avatar() {
  const navigate = useNavigate();
  const { isFetching, isError } = useUser();
  const user = useSelector((state) => state.userSlice);
  const { handleLogout: logout } = useAuth();
  const { getToast } = useToast();

  async function handleLogout() {
    await logout().then(() => {
      getToast("Đăng xuất thành công");
      // navigate('/portal/login')
    });
  }

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
    if (user.avatar) {
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
          <a className="justify-between">Profile</a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  );
}

export default Avatar;
