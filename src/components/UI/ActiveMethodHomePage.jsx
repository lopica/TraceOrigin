import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";

const ActiveMethodHomePage = () => {

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Tên nội dung */}
      <h2 className="text-3xl font-bold mb-4">Phương thức hoạt động</h2>

      {/* Hình ảnh */}
      <img
        src="https://smartindustry.vn/wp-content/uploads/2023/08/truy-xuat-nguon-goc-san-pham-trong-chuoi-cung-ung-huong-dan-co-ban-20230814-Smart-FactoryVN-22.png"
        alt="Content Illustration"
    
      />
    </div>
  );
};

export default ActiveMethodHomePage;
