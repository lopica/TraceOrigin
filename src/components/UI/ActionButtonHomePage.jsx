import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";

const ActionButtonHomePage = () => {

  return (
    <div className="space-y-2">
      <button className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSearch className="mr-2" />
      <span className="font-bold">TÌM KIẾM</span>
    </div>
    <FaArrowRight />
  </button>
  
  <button className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSignInAlt className="mr-2" />
      <span className="font-bold">ĐĂNG KÍ SẢN PHẨM | ĐĂNG NHẬP</span>
    </div>
    <FaArrowRight />
  </button>
  
  <button className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSearch className="mr-2" />
      <span className="font-bold mr-2">TRA CỨU SẢN PHẨM BẰNG HÌNH ẢNH </span>
    </div>
    <FaArrowRight />
  </button>
  
  <button className="w-full h-16 bg-transparent text-white text-left border border-white rounded-lg px-4 py-2 flex items-center justify-between hover:bg-blue-500 hover:text-white hover:border-blue-500">
    <div className="flex items-center">
      <FaSearch className="mr-2" />
      <span className="font-bold">TRA CỨU SẢN PHẨM BẰNG QR</span>
    </div>
    <FaArrowRight />
  </button>
    </div>
  );
};

export default ActionButtonHomePage;
