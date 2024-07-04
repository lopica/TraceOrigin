import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const Carousel = ({ images }) => {
  const settings = {
    customPaging: function (i) {
      return (
        <Link className='block w-14 h-14'>
          <img src={images[i]} alt={`Thumbnail ${i}`} className="w-30 h-30 object-cover border border-gray-300 mx-1" />
          {/* <div className=''>sdas</div> */}
        </Link>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className="slider-container mb-32 md:mb-20 lg:mb-0 max-w-lg mx-auto lg:w-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index}`} className="w-full h-auto" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "rgb(56 189 248)",  }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "rgb(56 189 248)", }}
        onClick={onClick}
      />
    );
  }

export default Carousel;
