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
    <div className="flex flex-col items-center justify-center md:p-24 p-2">
      {/* Tên nội dung */}
      <h2 className="text-3xl font-bold mb-4 text-center">Phương thức hoạt động</h2>

      {/* Hình ảnh */}
      <div className="p-8 w-full overflow-x-auto md:overflow-hidden">
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
