import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useShow from "../../hooks/use-show";
import { usePredictMutation } from "../../store";
import Modal from "../../components/UI/Modal";
import ImageClassification from "../../components/ImageClassification";
import QRCodeScanner from "../../components/QRCodeScanner";
import CustomUIQRCodeScanner from "../../components/CustomUIQRCodeScanner";

const ActionButtonHomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.authSlice);

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
      <ImageClassification />
    </Modal>
  );
  return (
    <div className=" p-6 space-y-2">
      <button className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSearch className="mr-2" />
      <span className="font-bold">TÌM KIẾM</span>
    </div>
    <FaArrowRight />
  </button>
  
  <Link to={isAuthenticated ? "/manufacturer/products" : "/portal/login"}  className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
  <div className="flex items-center">
      <FaSignInAlt className="mr-2" />
      <span className="font-bold">ĐĂNG KÍ SẢN PHẨM | ĐĂNG NHẬP</span>
    </div>
    <FaArrowRight />
      </Link>
  <button onClick={handleClick} className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSearch className="mr-2" />
      <span className="font-bold mr-2">TRA CỨU SẢN PHẨM BẰNG HÌNH ẢNH </span>
    </div>
    <FaArrowRight />
  </button>
  
  <button onClick={handleScannerOpen} className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSearch className="mr-2" />
      <span className="font-bold">TRA CỨU SẢN PHẨM BẰNG QR</span>
    </div>
    <FaArrowRight />
  </button>
  {showScanner && (
                <Modal onClose={handleScannerClose}>
                  <div className="p-4 pt-8">
                    <QRCodeScanner onClose={handleScannerClose} />
                    {/* <CustomUIQRCodeScanner /> */}
                  </div>
                </Modal>
              )}
              {showModal && modal}
    </div>
  );
};

export default ActionButtonHomePage;
