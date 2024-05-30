import { useEffect, useRef, useState } from "react";
import { CONSTANTS } from "../services/Constants";
import Bell from "./Bell";
import Avatar from "./Avatar";
import ThemeBtn from "./ThemeBtn";
import Hamburger from "./UI/Hamburger";

function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the state between true and false
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Close the dropdown if click is outside
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document
      .querySelector("html")
      .setAttribute("data-theme", localStorage.getItem("theme"));
  }, [theme]);

  const handleToggle = (e) => {
    return e.target.checked ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    // Add when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Remove when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuMobile = (
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
          <li>
            <a>Homepage</a>
          </li>
          <li>
            <a>Portfolio</a>
          </li>
          <li>
            <a>About</a>
          </li>
        </ul>
      )}
    </div>
  );

  const desktopHeader = (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">{CONSTANTS?.brand}</a>
      </div>
      <div className="flex-none gap-4">
        <ThemeBtn theme={theme} handleClick={handleToggle} />
        <Bell />
        <Avatar />
      </div>
    </div>
  );

  const mobileHeader = (
    <div className="navbar bg-base-100">
      <div className="navbar-start">{menuMobile}</div>
      <div className="navbar-center">
        <ThemeBtn theme={theme} handleClick={handleToggle} />
      </div>
      <div className="navbar-end">
        <Bell />
        <Avatar />
      </div>
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
