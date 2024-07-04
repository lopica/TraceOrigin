import { useNavigate } from "react-router-dom";
import {
  requireLogin,
  updateUser,
  useFetchUserQuery,
  useLogoutMutation,
} from "../store";
import { useDispatch } from "react-redux";
import useUser from "../hooks/use-user";
import useToast from "../hooks/use-toast";
import { useEffect } from "react";

let count = 0;
function Avatar() {
  const { isFetching, data, isError, error } = useUser();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const { getToast } = useToast();
  count++;

  function handleLogout() {
    dispatch(requireLogin());
    dispatch(updateUser({}));
    logout()
      .unwrap()
      .then((res) => {
        getToast(res);
      })
      .then(navigate("/"))
      .catch((res) => console.log(res));
  }

  useEffect(() => {
    if (count > 6 && isError) {
      if (error.status === 401) {
        console.log(isError);
        console.log(count);
        dispatch(requireLogin());
      }
    }
  }, [isError]);

  if (isFetching) {
    return <div className="skeleton h-10 w-10 shrink-0 rounded-full"></div>;
  } else if (isError) {
    return <p>Loi load ava</p>;
  } else {
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
}

export default Avatar;
