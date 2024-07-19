import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUsers, FaQrcode, FaRegRegistered } from 'react-icons/fa'; // Thay thế bằng icon bạn muốn sử dụng
import { useGetNumberVisitsAllTimeQuery } from '../../store/apis/elkApi';

const CarouselHomePage = () => {
  const { data: number } = useGetNumberVisitsAllTimeQuery();

  return (
    <div className="hidden sm:block w-full max-w-full mx-auto p-6">
      <div className="max-w-4xl mx-auto px-4 py-8 ">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold text-yellow-500 text-left">
            <span className="block">HỆ THỐNG</span>
            <span className="block">TRUY XUẤT NGUỒN GỐC</span>
          </h1>
        </div>
        <p className="text-lg text-white text-justify mb-8">
          Giải pháp dành cho tất cả mọi người thực hiện truy xuất nguồn gốc sản phẩm nhằm tăng giá trị và sự khác biệt so với các sản phẩm khác trên thị trường. Chứng nhận về chất lượng, nguồn.
        </p>
        <div className="flex justify-center gap-4">
          <div className="bg-green-500 text-white p-4 rounded-lg flex items-center space-x-4 w-80">
            <FaUsers className="text-3xl" />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">--</p>
              <h2 className="text-sm \text-center">Đối tác và khách hàng</h2>
            </div>
          </div>
          <div className="bg-green-500 text-white p-2 rounded-lg flex items-center space-x-4 w-80">
            <FaQrcode className="text-3xl" />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">{number}</p>
              <h2 className="text-sm text-center">Lượt truy xuất nguồn gốc</h2>
            </div>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg flex items-center space-x-4 w-80">
            <FaRegRegistered className="text-3xl" />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">--</p>
              <h2 className="text-sm text-center">Sản phẩm được đăng ký</h2>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default CarouselHomePage;
