import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarouselHomePage = () => {
  const slides = [
    {
      src: "https://www.most.gov.vn/Images/editor/images/Truy%20xuat%20nguon%20goc%201.jpg",
    },
    {
      src: "https://vinachg.vn/wp-content/uploads/2022/03/truy-xuat-nguon-go-vinachg-46456.jpg",
    },
    {
      src: "https://cdn.sgtiepthi.vn/wp-content/uploads/2019/12/MSTD_1212_Truy-xu%E1%BA%A5t-ngu%E1%BB%93n-g%E1%BB%91c-th%E1%BB%B1c-ph%E1%BA%A9m-ngay-tr%C3%AAn-%C4%91i%E1%BB%87n-tho%E1%BA%A1i-th%C3%B4ng-minh.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'white'
        }}
      ></div>
    )
  };

  return (
<div className="hidden sm:block w-full max-w-full mx-auto pt-9 p-6">
  <Slider {...settings}>
    {slides.map((slide, index) => (
      <div key={index} className="rounded-box w-full h-[400px] overflow-hidden">
        <img src={slide.src} alt={`slide-${index}`} className="rounded-box w-full h-full object-cover object-center" />
      </div>
    ))}
  </Slider>
</div>
  );
};

export default CarouselHomePage;
