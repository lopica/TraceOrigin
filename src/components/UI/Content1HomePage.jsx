import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";

const Content1HomePage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6">
        {/* Nửa trái: Nội dung */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold mb-4">
            Lợi ích của truy xuất nguồn gốc
          </h2>
        </div>
        {/* Nửa phải: Biểu đồ */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl mx-auto p-6">
            <ul className="space-y-4">
              <li className="flex items-start">
                <span>
                  <strong>Đảm bảo chất lượng:</strong> Xác minh nguồn gốc sản
                  phẩm.
                </span>
              </li>
              <li className="flex items-start">
                <span>
                  <strong>Minh bạch:</strong> Tăng niềm tin của khách hàng.
                </span>
              </li>
              <li className="flex items-start">
                <span>
                  <strong>Quản lý chuỗi cung ứng:</strong> Theo dõi quy trình
                  hiệu quả.
                </span>
              </li>
              <li className="flex items-start">
                <span>
                  <strong>Tuân thủ quy định:</strong> Đáp ứng yêu cầu pháp lý.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content1HomePage;
