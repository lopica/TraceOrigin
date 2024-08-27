import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  FaArrowRight,
  FaSignInAlt,
  FaSearch,
  FaQrcode,
  FaRobot,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useShow from "../../../hooks/use-show";
import { usePredictMutation } from "../../../store";
import Modal from "../Modal";
import ImageClassificationDemo from "../../ImageClassificationDemo";
import QRCodeScanner from "../../QRCodeScanner";
import CustomUIQRCodeScanner from "../../CustomUIQRCodeScanner";
import { useSearchAllManufacturerQuery } from "../../../store/apis/userApi";
import ShowInfoHomePage from "./ShowInfoHomePage";

const ActionButtonHomePage = () => {
  const user = useSelector((state) => state.userSlice);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { data: data } = useSearchAllManufacturerQuery();
  const [filteredData, setFilteredData] = useState([]);
  // ====================select manufacturer

  const handleItemClick = (id) => {
    setSelectedId(id);
    setIsPopupOpen(true);
    console.log(`Selected ID: ${id}`);
  };
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSearchTerm("");
    setFilteredData([]);
  };
  // ====================search in button
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Lọc dữ liệu nếu ô nhập liệu không rỗng
    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const filtered = data.filter((item) =>
        item.org_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleSearch = () => {
    // Xử lý tìm kiếm với searchTerm
    console.log("Searching for:", searchTerm);
  };
  // ======================
  const {
    show: showModal,
    handleOpen: handleClick,
    handleClose,
  } = useShow(false);
  const {
    show: showScanner,
    handleOpen: handleScannerOpen,
    handleClose: handleScannerClose,
  } = useShow(false);

  const modal = (
    <Modal onClose={handleClose}>
      <ImageClassificationDemo />
    </Modal>
  );
  // className="w-full h-16 bg-white text-black text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-color1 hover:text-white hover:border-color1"

  return (
    <div className=" p-6 space-y-2">
      <ShowInfoHomePage
        id={selectedId}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
      <div className="relative w-full h-16 rounded-lg bg-white hover:text-color1">
        <div className="flex justify-between items-center h-full bg-white rounded-lg px-4 py-2 ">
          <FaSearch className="mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="  Tìm kiếm tên nhãn hiệu ..."
            className="bg-transparent w-full h-full bg-white text-black rounded-lg p-4"
          />
        </div>
        {/* Danh sách lọc hiển thị dưới ô nhập liệu */}
        {filteredData.length > 0 && (
          <ul className="absolute w-full border border-gray-300 bg-white mt-2 rounded-lg shadow-lg z-10">
            {filteredData.map((item) => (
              <li
                key={item.userId}
                onClick={() => handleItemClick(item.userId)}
                className="text-black flex items-center px-4 py-2 hover:bg-gray-200  rounded-lg cursor-pointer"
              >
                <img
                  src={item.profileImage || "/default_avatar.png"}
                  alt={item.org_name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                {item.org_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        to={
          isAuthenticated
            ? user?.role.roleId === 1
              ? "/admin/ManufacturerList"
              : "/manufacturer/products"
            : "/portal/login"
        }
        className="w-full h-16  bg-white text-black text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-color1 hover:text-white hover:border-color1"
      >
        <div className="flex items-center">
          <FaSignInAlt className="mr-2" />
          <span className="font-bold mr-4">ĐĂNG KÍ SẢN PHẨM | ĐĂNG NHẬP</span>
        </div>
        <FaArrowRight />
      </Link>
      <button
        onClick={handleClick}
        className="w-full h-16  bg-white text-black text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-color1 hover:text-white hover:border-color1"
      >
        <div className="flex items-center">
          <FaRobot className="mr-2" />
          <span className="font-bold ">TRA CỨU SẢN PHẨM BẰNG AI </span>
        </div>
        <FaArrowRight />
      </button>

      <button
        onClick={handleScannerOpen}
        className="w-full h-16  bg-white text-black text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-color1 hover:text-white hover:border-color1"
      >
        <div className="flex items-center">
          <FaQrcode className="mr-2" />
          <span className="font-bold">TRA CỨU SẢN PHẨM BẰNG QR</span>
        </div>
        <FaArrowRight />
      </button>
      {showScanner && (
        <Modal onClose={handleScannerClose}>
          <div className="p-4 pt-8">
            {/* <QRCodeScanner onClose={handleScannerClose} /> */}
            <CustomUIQRCodeScanner />
          </div>
        </Modal>
      )}
      {showModal && modal}
    </div>
  );
};

export default ActionButtonHomePage;
