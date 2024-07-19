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
    <div className="flex flex-col items-center justify-center p-24">
      {/* Tên nội dung */}
      <h2 className="text-3xl font-bold mb-4 text-center">Phương thức hoạt động</h2>

      {/* Hình ảnh */}
      <div className="items-center p-8 overflow-x-auto w-screen">
        <div className="flex items-center min-h-max space-x-8 min-w-[60rem] ">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex flex-1 items-center space-x-4 text-center"
              >
                <div className="flex flex-col items-center min-w-[5rem]">
                  <Icon className="w-12 h-12 text-blue-500" />
                  <h3 className="mt-2 font-bold text-xs">{step.title}</h3>
                  {step.description && (
                    <p className="mt-1 text-xs text-center max-w-xs overflow-x-auto whitespace-pre-wrap min-w-0">
                      {step.description}
                    </p>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div>
                    <FaArrowRight className="w-8 h-8 text-blue-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActiveMethodHomePage;
