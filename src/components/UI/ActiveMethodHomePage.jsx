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
  const steps = [
    {
      icon: FaIndustry,
      title: "Nhà sản xuất",
      description: "(đăng ký sản phẩm)",
    },
    {
      icon: FaCogs,
      title: "Hệ thống TOS",
      description: "",
    },
    {
      icon: FaQrcode,
      title: "Tạo mã QR riêng cho từng sản phẩm",
      description: "",
    },
    {
      icon: FaTruck,
      title: "Sản phẩm được theo dõi di chuyển",
      description: "",
    },
    {
      icon: FaMobileAlt,
      title: "Người dùng quét mã trên sản phẩm",
      description: "",
    },
    {
      icon: FaSearch,
      title: "Hệ thống truy xuất thông tin dựa trên QR",
      description: "",
    },
    {
      icon: FaInfoCircle,
      title: "Hệ thống hiển thị thông tin nguồn gốc sản phẩm",
      description: "",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-10">
      {/* Tên nội dung */}
      <h2 className="text-3xl font-bold mb-4 text-center">Phương thức hoạt động</h2>

      {/* Hình ảnh */}
      {/* <div className="items-center p-8 overflow-x-auto w-screen"> */}
      <div className="items-center p-8">
      <img 
              src="/workflow-process.png" // Đường dẫn tới logo của hãng
              alt="Logo"
              className="
               object-contain" // Điều chỉnh kích thước logo theo ý muốn
            />
      
      </div>
    </div>
  );
};

export default ActiveMethodHomePage;
