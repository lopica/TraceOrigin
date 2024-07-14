import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";

const Content1HomePage = () => {
  return (

    <div className="flex flex-col items-center justify-center p-10">
      {/* Tên nội dung */}
      <h2 className="text-3xl font-bold mb-4"> Truy xuất nguồn gốc là gì?</h2>
      <div className="max-w-4xl mx-auto p-6 text-center">
            <strong>Truy xuất nguồn gốc sản phẩm </strong> là một giải pháp cho
            người dùng truy xuất, tìm hiểu về thông tin nguồn gốc xuất xứ của
            sản phẩm mà họ đã mua, truy ngược từ sản phẩm đang được bày bán trên
            kệ hàng về nơi sản xuất ban đầu, rà soát từng công đoạn chế tác và phân phối.
          </div>
    </div>
  );
};

export default Content1HomePage;
