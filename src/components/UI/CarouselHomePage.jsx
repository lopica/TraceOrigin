import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const CarouselHomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      src: "https://www.most.gov.vn/Images/editor/images/Truy%20xuat%20nguon%20goc%201.jpg",
      alt: "First Slide",
      label: "First Slide",
    },
    {
      src: "https://vinachg.vn/wp-content/uploads/2022/03/truy-xuat-nguon-go-vinachg-46456.jpg",
      alt: "Second Slide",
      label: "Second Slide",
    },
    {
      src: "https://cdn.sgtiepthi.vn/wp-content/uploads/2019/12/MSTD_1212_Truy-xu%E1%BA%A5t-ngu%E1%BB%93n-g%E1%BB%91c-th%E1%BB%B1c-ph%E1%BA%A9m-ngay-tr%C3%AAn-%C4%91i%E1%BB%87n-tho%E1%BA%A1i-th%C3%B4ng-minh.jpg",
      alt: "Third Slide",
      label: "Third Slide",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [slides.length]);

  return (
    <div className="max-w-xl mx-auto hidden sm:block">
      <div id="default-carousel" className="relative" data-carousel="static">
        {/* Carousel wrapper */}
        <div className="overflow-hidden relative h-56 rounded-lg sm:w-64 md:w-80 lg:w-96 xl:w-180 2xl:w-96 sm:h-64 xl:h-80 2xl:h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`duration-700 ease-in-out ${index === currentIndex ? '' : 'hidden'}`}
              data-carousel-item
            >
              <span className="absolute top-1/2 left-1/2 text-2xl font-semibold text-white -translate-x-1/2 -translate-y-1/2 sm:text-3xl">
                {slide.label}
              </span>
              <img
                src={slide.src}
                className="block absolute top-0 left-0 w-full h-full object-cover"
                alt={slide.alt}
              />
            </div>
          ))}
        </div>

        {/* Slider indicators */}
        <div className="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-current={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              data-carousel-slide-to={index}
            ></button>
          ))}
        </div>

        {/* Slider controls */}
        <button
          type="button"
          className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
          data-carousel-prev
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)}
        >
          <span className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="hidden">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
          data-carousel-next
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)}
        >
          <span className="inline-flex justify-center items-center w-8 h-8 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span className="hidden">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CarouselHomePage;
