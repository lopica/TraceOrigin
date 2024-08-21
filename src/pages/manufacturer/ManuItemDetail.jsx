import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import ItemLine from "../../components/ItemLine";
import ItemOrigin from "../../components/ItemOrigin";
import { useLocation } from "react-router-dom";
import Consign from "../../components/Consign";
import useToast from "../../hooks/use-toast";
import ItemEvent from "../../components/ItemEvent";
import NoApiConsign from "../../components/NoApiConsign";

export default function ItemDetail() {
  const location = useLocation();
  const productRecognition = location.pathname.split("/").pop();
  const swiperRef = useRef(null);
  const { getToast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [eventType, setEventType] = useState("origin");
  const [currentEventId, setCurrentEventId] = useState("");

  const goToItemOrigin = () => {
    setEventType("origin");
    if (swiperRef.current) {
      swiperRef.current.slideTo(1, 500); // Slide indices start at 0
    }
  };

  const goToItemLine = () => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 500); // Slide indices start at 0
    }
  };

  const goToEvent = (eventId) => {
    setEventType("event");
    setCurrentEventId(eventId);
    if (swiperRef.current) {
      swiperRef.current.slideTo(1, 500); // Slide indices start at 0
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

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên dăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);

  return (
    <section className="relative">
      {/* <Consign productRecognition={productRecognition} /> */}
      <NoApiConsign productRecognition={productRecognition} />
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
                  goToEvent={goToEvent}
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {eventType === "origin" && (
              <ItemOrigin goToItemLine={goToItemLine} />
            )}
            {eventType === "event" && (
              <ItemEvent goToItemLine={goToItemLine} eventId={currentEventId} />
            )}
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="hidden lg:grid lg:grid-cols-6">
        <div className="col-span-2 flex flex-col justify-between">
          <div className=" overflow-y-auto">
            <ItemLine
              productRecognition={productRecognition}
              goToItemOrigin={goToItemOrigin}
              goToEvent={goToEvent}
            />
          </div>
        </div>
        <div className="col-span-4">
          {eventType === "origin" && <ItemOrigin goToItemLine={goToItemLine} />}
          {eventType === "event" && (
            <ItemEvent goToItemLine={goToItemLine} eventId={currentEventId} />
          )}
        </div>
      </div>
    </section>
  );
}
