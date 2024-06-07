import { useEffect, useRef, useState } from "react";
import { CONSTANTS } from "../services/Constants";
import Bell from "./Bell";
import Avatar from "./Avatar";
import ThemeBtn from "./ThemeBtn";
import Hamburger from "./UI/Hamburger";
import { Link, useLocation } from "react-router-dom";
import { useFetchUserQuery } from "../store";
// import { getCookie } from "../utils/getCookie";

function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility
  const dropdownRef = useRef(null);
  const { error, isFetching } = useFetchUserQuery();
  let location = useLocation();

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

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document
      .querySelector("html")
      .setAttribute("data-theme", localStorage.getItem("theme"));
  }, [theme]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(()=>{
  //   async function fetchUser() {
  //     try {
  //       const response = await fetch('http://localhost:8080/api/user/me', {
  //         credentials: "include"  // Correct value for including cookies
  //       });
  //       const data = await response.json();  // Properly handle the JSON promise
  //       console.log('o day');
  //       console.log(data);
  //     } catch (error) {
  //       console.error('Failed to fetch user:', error);
  //     }
  //   }
  //   fetchUser();
  // },[])

  let userContent;
  let menuMobile;
  // userContent = (
  //       <Link to="/login">
  //         <p className="ml-4">Đăng nhập</p>
  //       </Link>
  //     );

  // Check if the current path is /login or /register
  if (!location.pathname.startsWith("/manufacturer")) {
    userContent = (
      <Link to="/portal/login">
        <p className="btn btn-ghost text-xl ml-4">Portal</p>
      </Link>
    );;
    menuMobile = <a className="btn btn-ghost text-xl">{CONSTANTS?.brand}</a>;
  } else if (isFetching) {
    userContent = (
      <>
        <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
        <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
      </>
    );
    menuMobile = (
      <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
    );
  } else if (error) {
    console.log(error);
    userContent = (
      <ul>
        <li>
          <Link to="/portal/login">
            <p className="ml-4">Đăng nhập</p>
          </Link>
        </li>
      </ul>
    );
    menuMobile = <p>{CONSTANTS.brand}</p>;
  } else {
    userContent = (
      <>
        <Bell />
        <Avatar />
      </>
    );
    menuMobile = (
      <div className="dropdown" ref={dropdownRef}>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle"
          onClick={toggleDropdown} // Attach the toggle function to the click event
        >
          <Hamburger />
        </div>
        {isOpen && ( // Conditional rendering based on the isOpen state
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-[97vw]"
          >
          {CONSTANTS.menu.map(item=>{
            return <li key={item.name}>
              <Link to={item.url}>{item.name}</Link>
            </li>
          })}
          </ul>
        )}
      </div>
    );
  }

  const desktopHeader = (
    <div className="navbar bg-base-100 px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{CONSTANTS?.brand}</a>
      </div>
      <div className="flex-none gap-4">
        <ThemeBtn theme={theme} handleClick={handleToggle} />
        {userContent}
      </div>
    </div>
  );

  const mobileHeader = (
    <div className="navbar bg-base-100">
      <div className="navbar-start">{menuMobile}</div>
      <div className="navbar-center">
        <ThemeBtn theme={theme} handleClick={handleToggle} />
      </div>
      <div className="navbar-end">{userContent}</div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{desktopHeader}</div>
      <div className="block md:hidden">{mobileHeader}</div>
    </>
  );
}

export default Header;
