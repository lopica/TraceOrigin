import { Fragment } from "react";
import { CONSTANTS } from "../../services/Constants";
import { Link } from "react-router-dom";

export default function SideBar() {
    
  return (
    <Fragment>
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu p-4 w-52 min-h-full bg-base-100 text-base-content">
        {/* Sidebar content here */}
        {CONSTANTS.menu.map((item) => {
          return (
            <li key={item.name}>
              <Link to={item.url}>{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
}
