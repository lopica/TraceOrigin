import { FaBell } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import ManuSideBar from "../../components/Sidebar";

function ManuLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 h-screen">
      <div className="md:col-span-1 h-full">
        <ManuSideBar className="fixed md:w-1/6 w-full h-full" />
      </div>
      <div className="md:col-span-5 ml-4 md:ml-1/6 mt-4 overflow-auto">
        <div className="flex flex-col">
          <div className="flex justify-between mb-2 mr-8 pb-2 border-b-2">
            <div>Breadcrumb</div>
            <div><FaBell className="text-3xl text-gray-500" /></div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ManuLayout;
