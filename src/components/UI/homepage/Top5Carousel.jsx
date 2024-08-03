import React, { useState } from "react";
import Slider from "react-slick";
import { useTop5OrgNamesQuery } from "../../../store/apis/userApi";
import ShowInfoHomePage from "./ShowInfoHomePage";


const Top5Carousel = () => {
  const { data: data } = useTop5OrgNamesQuery();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ========================================================= handle click 
  const handleItemClick = (id) => {
    setSelectedId(id);
    setIsPopupOpen(true);
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 3, // Hiển thị 3 item cùng lúc
    slidesToScroll: 1,
    autoplay: true, // Bật tự động chạy
    autoplaySpeed: 3000, // Thay đổi tốc độ tự động chạy (3 giây)
    // arrows: true, // Hiển thị mũi tên điều hướng
    // dots: true, // Hiển thị các chấm điều hướng
    cssEase: "linear",
  };
  return (
    <div  className="flex flex-col md:p-12">
     <h2 className="text-md md:text-xl mb-12 font-bold text-center">
      NHỮNG ĐỐI TÁC TIÊU BIỂU
      </h2>
    <div>
        <ShowInfoHomePage
        id={selectedId}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
      <Slider {...settings}>
        {data && data.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => handleItemClick(item.userId)}
              className="flex items-center text-center justify-center cursor-pointer p-4"
            >
              <img
                src={item.userImage || "/default_avatar.png"}
                alt={item.orgName}
                className="w-16 h-16 rounded-full mr-2"
              />
              <span className="text-black text-md font-bold">{item.orgName}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    </div>
  );
};

export default Top5Carousel;
