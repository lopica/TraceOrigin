import { useNavigate } from "react-router-dom";
import { requireLogin, useFetchUserQuery, useLogoutMutation } from "../store";
import { useDispatch } from "react-redux";
function Avatar() {
  const { data, isError, isFetching } = useFetchUserQuery();
  const dispatch = useDispatch()
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(requireLogin())
    logout().unwrap().then(navigate("/"));
  }

  if (isFetching) {
    return <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>
  }



  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          />
        </div>
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
