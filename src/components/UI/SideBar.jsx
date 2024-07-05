import { Fragment } from "react";
import { CONSTANTS } from "../../services/Constants";
import { Link } from "react-router-dom";

export default function SideBar() {
    
  return (
    <>
      {/* <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label> */}
      <ul className="menu p-4  min-h-full">
        {/* Sidebar content here */}
        {CONSTANTS.menu.map((item) => {
          return (
            <li key={item.name}>
              <Link to={item.url} className="focus:text-white text-lg xl:text-2xl hover:bg-opacity-50 hover:bg-sky-200">{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
