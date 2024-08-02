import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ItemLine from "../../components/ItemLine.jsx";
import ItemOrigin from "../../components/ItemOrigin.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import Consign from "../../components/Consign.jsx";
import ItemEvent from "../../components/ItemEvent.jsx";
import NoApiConsign from "../../components/NoApiConsign.jsx";

function Item() {
  //   const [originId, setOriginId] = useState("");
  let [searchParams] = useSearchParams();
  let productRecognition = searchParams.get("productRecognition");
  const swiperRef = useRef(null);
  const [eventType, setEventType] = useState("origin");
  const [currentEventId, setCurrentEventId] = useState(undefined);

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

  return (
    <section>
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
            <ItemLine
              productRecognition={productRecognition}
              goToItemOrigin={goToItemOrigin}
              goToEvent={goToEvent}
            />
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
        <div className="col-span-2">
          <ItemLine
            productRecognition={productRecognition}
            goToItemOrigin={goToItemOrigin}
            goToEvent={goToEvent}
          />
        </div>
        <div className="col-span-4 mt-2">
          {eventType === "origin" && <ItemOrigin goToItemLine={goToItemLine} />}
          {eventType === "event" && (
            <ItemEvent goToItemLine={goToItemLine} eventId={currentEventId} />
          )}
        </div>
      </div>
    </section>
  );
}

export default Item;
