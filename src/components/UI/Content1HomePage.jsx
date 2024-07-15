import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";

const Content1HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      {/* Tên nội dung */}
      <h2 className="text-3xl font-bold mb-4">
        {" "}
        Dịch vụ xác thực sản phẩm là gì?
      </h2>
      <div className="max-w-4xl mx-auto p-6 text-center">
        Dịch vụ xác thực sản phẩm là một hệ thống cho phép người dùng xác minh
        tính xác thực của một sản phẩm bằng cách truy xuất thông tin nguồn gốc
        của sản phẩm, bao gồm nhà sản xuất, nơi sản xuất, chứng chỉ, lịch sử
        giao dịch,.. Quá trình kiểm tra và xác minh rằng sản phẩm bạn mua là
        hàng thật, không phải hàng giả, hàng nhái hoặc hàng kém chất lượng.
      </div>
    </div>
  );
};

export default Content1HomePage;
