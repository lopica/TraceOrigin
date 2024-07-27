import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  FaIndustry,
  FaArrowRight,
  FaCogs,
  FaQrcode,
  FaTruck,
  FaMobileAlt,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";

const ActiveMethodHomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center md:p-24 py-12">
      {/* Tên nội dung */}
      <h2 className="text-xl font-bold mb-4 text-center">PHƯƠNG THỨC HOẠT ĐỘNG</h2>

      {/* Hình ảnh */}
      <div className="p-1 md:p-8 w-full overflow-x-auto md:overflow-hidden">
        <img 
          src="/workflow-process.png" // Đường dẫn tới logo của hãng
          alt="Logo"
          className="object-contain" // Điều chỉnh kích thước logo theo ý muốn
        />
      </div>
    </div>
  );
};

export default ActiveMethodHomePage;
