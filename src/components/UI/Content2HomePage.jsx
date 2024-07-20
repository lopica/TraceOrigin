import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FaCheckCircle, FaInfoCircle, FaLink, FaRegClipboard } from 'react-icons/fa';


const Content2HomePage = () => {
  const benefits = [
  {
    icon: FaCheckCircle,
    header: 'Đảm bảo chất lượng',
    content: 'Xác minh nguồn gốc sản phẩm.',
  },
  {
    icon: FaInfoCircle,
    header: 'Minh bạch',
    content: 'Tăng niềm tin của khách hàng.',
  },
  {
    icon: FaLink,
    header: 'Quản lý chuỗi cung ứng',
    content: 'Theo dõi quy trình hiệu quả.',
  },
  {
    icon: FaRegClipboard,
    header: 'Tuân thủ quy định',
    content: 'Đáp ứng yêu cầu pháp lý.',
  },
];
  return (
    <div className="p-2 md:p-24">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto ">
        {/* Nửa trái: Nội dung */}
        <div className="md:w-1/2 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold mb-4">
            Lợi ích của truy xuất nguồn gốc
          </h2>
        </div>
        {/* Nửa phải: Biểu đồ */}
        <div className="md:w-1/2 p-4 flex flex-col items-center justify-center  text-justify text-lg">
          <div className="max-w-4xl mx-auto p-6">
            <strong>TRACE ORIGIN</strong> là nền tảng truy xuất nguồn gốc chuỗi
            cung ứng trên thị trường, giúp các doanh nghiệp bảo vệ thương
            hiệu và chuỗi cung ứng của họ, khai thác hiệu quả chuỗi cung ứng,
            giảm thiểu lãng phí, nâng cao uy tín.
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center  mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="text-center">
              <Icon className="w-12 h-12 mx-auto  text-color1" />
              <h3 className="mt-2 font-bold text-lg">{benefit.header}</h3>
              <p className="mt-1">{benefit.content}</p>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default Content2HomePage;
