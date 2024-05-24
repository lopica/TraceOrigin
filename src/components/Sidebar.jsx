import { useState } from "react";

function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <div className={`md:hidden ml-2`} onClick={toggleSidebar}>
        Hamburger
      </div>
      <div
        className={`flex-col justify-between ${
          isSidebarOpen ? "flex" : "hidden"
        } md:flex md:h-svh`}
      >
        <nav className={`ml-2`}>
          <ul className="flex flex-col gap-2">
            <li>menu 1</li>
            <li>menu 2</li>
            <li>menu 3</li>
          </ul>
        </nav>
        <div className={`flex justify-between border-t-2`}>
          <p>Login/Logout</p>
          <div>User</div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
