import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import ItemLine from "../../components/ItemLine";
import ItemOrigin from "../../components/ItemOrigin";
import { useLocation } from "react-router-dom";

export default function ItemDetail() {
  const location = useLocation();
  const productRecognition = location.pathname.split("/").pop();
  const swiperRef = useRef(null);
  const qrContainerRef = useRef(null);

  const goToItemOrigin = () => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(1, 500); // Slide indices start at 0
    }
  };

  const goToItemLine = () => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 500); // Slide indices start at 0
    }
  };

  const onSlideChange = () => {
    if (swiperRef.current) {
      console.log("Current Slide Index:", swiperRef.current.activeIndex);
      if (swiperRef.current.activeIndex === 0) {
        swiperRef.current.slideTo(0, 0);
      }
    }
  };


  return (
    <section>
      <div className="block lg:hidden">
        <Swiper
          autoHeight
          noSwipingClass="swiper-no-swiping"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={onSlideChange}
          speed={500}
          simulateTouch={true}
          scrollbar={{ draggable: true }}
        >
          <SwiperSlide className="text-center w-svw sm:w-[lg] mx-auto ">
            <div className="flex flex-col justify-between ">
              <div className=" overflow-y-auto">
                <ItemLine
                  productRecognition={productRecognition}
                  goToItemOrigin={goToItemOrigin}
                  add
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <ItemOrigin goToItemLine={goToItemLine} />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="hidden lg:grid lg:grid-cols-6">
        <div className="col-span-2 flex flex-col justify-between">
          <div className=" overflow-y-auto">
            <ItemLine
              productRecognition={productRecognition}
              goToItemOrigin={goToItemOrigin}
              add
            />
          </div>
        </div>
        <div className="col-span-4">
          <ItemOrigin goToItemLine={goToItemLine} />
        </div>
      </div>
    </section>
  );
}
