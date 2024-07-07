import { Fragment } from "react";
import { CONSTANTS } from "../../services/Constants";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideBar() {
  const role = useSelector(state => state.userSlice.role);
  const roleId = role?.roleId;

  const filteredMenu = roleId === 1
    ? CONSTANTS.menu.filter(item => item.role === '1')
    : CONSTANTS.menu.filter(item => item.role !== '1');

  return (
    <>
      {/* <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label> */}
      <ul className="menu p-4 min-h-full">
        {/* Sidebar content here */}
        {filteredMenu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.url}
              className="focus:text-white text-lg xl:text-2xl hover:bg-opacity-50 hover:bg-sky-200"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
