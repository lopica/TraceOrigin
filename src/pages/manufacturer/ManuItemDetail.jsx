import QRCode, { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import ItemLine from "../../components/ItemLine";
import ItemOrigin from "../../components/ItemOrigin";
import { useLocation } from "react-router-dom";
import Button from "../../components/UI/Button";

let qr;
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

  const downloadQR = () => {
    if (qrContainerRef.current) {
      const svgElement = qrContainerRef.current.querySelector("svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobURL;
        downloadLink.download = `${productRecognition}.svg`; // Set the download file name
        document.body.appendChild(downloadLink); // Append to body to make it work in Firefox
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up
      } else {
        console.error("No SVG found");
      }
    }
  };

  qr = (
    <div className="flex flex-col gap-4 justify-center items-center">
      <div ref={qrContainerRef}>
        <QRCodeSVG
          value={`https://trace-origin.netlify.app/item?productRecognition=${productRecognition}`}
          size={256}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
      </div>
      <Button primary className="w-fit" onClick={downloadQR}>
        Xuất ảnh QR
      </Button>
    </div>
  );

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
          <SwiperSlide className="text-center w-svw sm:w-[lg] min-h-[90svh] mx-auto ">
            <div className="flex flex-col justify-between h-[86svh]">
              <div className="h-[48svh] overflow-y-auto">
                <ItemLine
                  productRecognition={productRecognition}
                  goToItemOrigin={goToItemOrigin}
                  add
                />
              </div>
              {qr}
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <ItemOrigin goToItemLine={goToItemLine} />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="hidden lg:grid lg:grid-cols-6">
        <div className="col-span-2 flex flex-col justify-between">
          <div className="h-[46svh] overflow-y-auto">
            <ItemLine
              productRecognition={productRecognition}
              goToItemOrigin={goToItemOrigin}
              add
            />
          </div>
          {qr}
        </div>
        <div className="col-span-4">
          <ItemOrigin goToItemLine={goToItemLine} />
        </div>
      </div>
    </section>
  );
}
