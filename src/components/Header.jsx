import { useEffect, useRef, useState } from "react";
import { CONSTANTS } from "../services/Constants";
// import Bell from "./Bell";
import Avatar from "./Avatar";
import ThemeBtn from "./ThemeBtn";
import Hamburger from "./UI/Hamburger";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const user = useSelector((state) => state.userSlice);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  let location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the state between true and false
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Close the dropdown if click is outside
    }
  };

  const handleToggle = (e) => {
    return e.target.checked ? setTheme("dark") : setTheme("light");
  };

  // useEffect(() => {
  //   localStorage.setItem("theme", theme);
  //   document
  //     .querySelector("html")
  //     .setAttribute("data-theme", localStorage.getItem("theme"));
  // }, [theme]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let userContent;
  let menuMobile;

  if (
    !location.pathname.startsWith("/manufacturer") &&
    !location.pathname.startsWith("/admin")
  ) {
    menuMobile = (
      <Link
        to="/"
        className="btn btn-ghost text-xl flex items-center justify-center w-[233px] h-[54px]"
      >
        <img
          src="/logo_full.png"
          alt="logo"
          className="max-w-full max-h-full object-contain"
        />
      </Link>
    );
    userContent = (
      <Link to={isAuthenticated ? "/manufacturer/products" : "/portal/login"}>
        <p className="btn btn-ghost text-xl ml-4">Portal</p>
      </Link>
    );
  } else {
    userContent = (
      <>
        {/* <Bell /> */}
        <Avatar />
      </>
    );

    menuMobile = (
      <div className="dropdown" ref={dropdownRef}>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle"
          onClick={toggleDropdown}
        >
          <Hamburger />
        </div>
        {isOpen && (
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-[97vw]"
          >
            <li key="brand">
              <Link to="/">{CONSTANTS.brand}</Link>
            </li>
            {CONSTANTS.menu.map((item, idx) => {
              const role = user.role.roleId;
              if (role == item.role) {
                return (
                  <li key={idx}>
                    <Link to={item.url}>{item.name}</Link>
                  </li>
                );
              }
            })}
          </ul>
        )}
      </div>
    );
  }

  const desktopHeader = (
    <div className="navbar bg-white border">
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-xl flex items-center justify-center w-[233px] h-[54px]"
        >
          <img
            src="/logo_full.png"
            alt="logo"
            className="max-w-full max-h-full object-contain"
          />
        </Link>
      </div>
      <div className="flex-none gap-4">
        {/* <ThemeBtn theme={theme} handleClick={handleToggle} /> */}
        {userContent}
      </div>
    </div>
  );

  const mobileHeader = (
    <div className="navbar bg-white border">
      <div className="navbar-start">{menuMobile}</div>
      <div className="navbar-center">
        {/* <ThemeBtn theme={theme} handleClick={handleToggle} /> */}
      </div>
      <div className="navbar-end">{userContent}</div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block ">{desktopHeader}</div>
      <div className="block md:hidden ">{mobileHeader}</div>
    </>
  );
}

export default Header;
