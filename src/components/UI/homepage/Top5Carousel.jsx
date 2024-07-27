import React from "react";
import Slider from "react-slick";
import { useSearchAllManufacturerQuery } from "../../../store/apis/userApi";

const marqueeData = [
  "Người nổi bật 1",
  "Người nổi bật 2",
  "Người nổi bật 3",
  "Người nổi bật 4",
  "Người nổi bật 5",
];

const handleItemClick = (id) => {
  // Xử lý sự kiện khi click vào item
};
const Top5Carousel = () => {
  const { data: data } = useSearchAllManufacturerQuery();

  const settings = {
    infinite: true,
    speed: 10000, // Tốc độ chạy của marquee
    slidesToShow: 2, // Hiển thị tất cả các item
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Tốc độ tự động chạy liên tục
    pauseOnHover: false,
    arrows: false,
    dots: false,
    cssEase: "linear", // Đảm bảo hiệu ứng mượt mà
  };
  return (
    <div className="overflow-hidden">
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => handleItemClick(item.userId)}
              className="flex items-center text-center justify-center p-4"
            >
              <img
                src={item.profileImage || "/default_avatar.png"}
                alt={item.org_name}
                className="w-12 h-12 rounded-full mr-2"
              />
              <span className="text-white font-bold">{item.org_name}</span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Top5Carousel;
