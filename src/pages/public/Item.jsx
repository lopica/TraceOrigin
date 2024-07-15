import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getDateFromEpochTime } from "../../utils/getDateFromEpochTime.js";
import {
  useFetchEventByItemLogIdQuery,
  useFetchItemLogsByProductRecognitionQuery,
  useFetchOriginByItemLogIdQuery,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { hideToast, showToast } from "../../store";
import Toast from "../../components/UI/Toast";
import ItemLine from "../../components/ItemLine.jsx";
import ItemOrigin from "../../components/ItemOrigin.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import Button from "../../components/UI/Button.jsx";
import { MdOutlineTransferWithinAStation } from "react-icons/md";

function Item() {
  //   const [originId, setOriginId] = useState("");
  let [searchParams] = useSearchParams();
  let productRecognition = searchParams.get("productRecognition");
  const swiperRef = useRef(null);

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

  //   const [currentEvent, setCurrentEvent] = useState("");
  //   const dispatch = useDispatch();

  // const { data: originData, isError: isOriginError, isFetching: isOriginFetching } = useFetchOriginByItemLogIdQuery(originId, {
  //     skip: !itemLogsData
  // });
  // const { data: eventData, isError: isEventError, isFetching: isEventFetching } = useFetchEventByItemLogIdQuery(currentEvent, {
  //     skip: !itemLogsData && currentEvent !== originId && originId
  // });

  // let eventCard;

  // useEffect(() => {
  //     if (itemLogsData && !currentEvent) {
  //         setOriginId(itemLogsData?.itemLogDTOs[0]?.itemLogId);
  //         setCurrentEvent(originId);
  //         //set map
  //     } else {
  //         //set id event
  //         //setCurrentEvent(originId);
  //     }
  // }, [itemLogsData, currentEvent]);

  // // if (isOriginFetching || isEventFetching) {
  // if (isOriginFetching || isEventFetching) { //test
  //     eventCard = <div className="card-body">
  //         <div className="skeleton w-full"></div>
  //         <ul className="flex flex-col gap-2">
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //             <li>
  //                 <div className="skeleton w-full h-48">&#8203;</div>
  //             </li>
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //             <li><div className="skeleton w-full">&#8203;</div></li>
  //         </ul>
  //     </div>
  //     // } else if ((isOriginError && currentEvent === originId) || (isEventError)) {
  // } else if ((isOriginError)) { //test
  //     eventCard = <div className="card-body">
  //         <p>Gặp lỗi khi lấy dữ liệu nguồn gốc sản phẩm</p>
  //     </div>
  // }  else if ((isEventError)) { //test
  //     eventCard = <div className="card-body">
  //         <p>Gặp lỗi khi lấy dữ liệu sự kiện về sản phẩm</p>
  //     </div>
  // } else {
  //     if (originData) {
  //         eventCard = (currentEvent !== originId) && (currentEvent != '') ?
  //             (
  //                 <div className="card-body">
  //                     <h2 className="mb-4 text-center font-bold">{eventData?.eventType}</h2>
  //                     <ul className="space-y-2">
  //                         {/* uy quyen, giao hang, nhan */}
  //                         <li><p>Người gửi: {eventData?.sender || 'chưa rõ'}</p></li>
  //                         <li><p>Người nhận: {eventData?.receiver || 'chưa rõ'}</p></li>
  //                         <li><p className="mb-2">Địa điểm diễn ra:</p>
  //                             <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
  //                                 <TileLayer
  //                                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //                                 />
  //                                 <Marker position={center}>
  //                                     <Popup>
  //                                         A pretty CSS3 popup. <br /> Easily customizable.
  //                                     </Popup>
  //                                 </Marker>
  //                                 <SetViewOnClick coords={center} />
  //                             </MapContainer>
  //                         </li>
  //                         <li><p>Thời gian diễn ra: {getDateFromEpochTime(eventData?.timeReceive) || 'chưa rõ'}</p></li>
  //                         <li><p>Mô tả sự kiện: {eventData?.descriptionItemLog || 'chưa rõ'}</p></li>
  //                     </ul>
  //                 </div>
  //             )
  //             : (<div className="card-body">
  //                 <h2 className="mb-4 text-center font-bold">Nguồn gốc</h2>
  //                 <ul className="space-y-2">
  //                     <li><p>Tên sản phẩm: {originData?.productName || 'chưa rõ'}</p></li>
  //                     <li><p>Mã qr: {productRecognition || 'chưa rõ'}</p></li>
  //                     <li><p>Đơn vị sản xuất: {originData?.orgName || 'chưa rõ'}</p></li>
  //                     <li><p className="mb-2">Địa điểm sản xuất:</p>
  //                         <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
  //                             <TileLayer
  //                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //                             />
  //                             <Marker position={center}>
  //                                 <Popup>
  //                                     A pretty CSS3 popup. <br /> Easily customizable.
  //                                 </Popup>
  //                             </Marker>
  //                             <SetViewOnClick coords={center} />
  //                         </MapContainer>
  //                     </li>
  //                     <li><p>Thời gian tạo: {getDateFromEpochTime(originData?.createAt) || 'chưa rõ'}</p></li>
  //                     <li><p>Mô tả sản phẩm: {originData?.descriptionOrigin || 'chưa rõ'}</p></li>
  //                     <li><p>Hạn bảo hành: {`${originData?.warranty} tháng` || 'chưa rõ'}</p></li>
  //                     <li><p>Ảnh/model 3d của sản phẩm: </p></li>
  //                 </ul>
  //             </div>
  //             );
  //     } else {
  //         eventCard = <div className="card-body">
  //             <div className="skeleton w-full"></div>
  //             <ul className="space-y-2">
  //                 <li><div className="skeleton w-full"></div></li>
  //                 <li><div className="skeleton w-full"></div></li>
  //                 <li><div className="skeleton w-full"></div></li>
  //                 <li><div className="skeleton w-full"></div>
  //                     <div className="skeleton w-full h-32"></div>
  //                 </li>
  //                 <li><div className="skeleton w-full"></div></li>
  //                 <li><div className="skeleton w-full"></div></li>
  //                 <li><div className="skeleton w-full"></div></li>
  //                 <li><div className="skeleton w-full"></div></li>
  //             </ul>
  //         </div>
  //     }
  // }

  return (
    <section className="relative">
      {/* <Button className="absolute bottom-2 right-6 z-10 bg-sky-400 rounded-full h-12 w-12 p-2 lg:bottom-4 lg:right-8">
        <MdOutlineTransferWithinAStation className="w-8 h-8" />
      </Button> */}
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
            />
          </SwiperSlide>
          <SwiperSlide>
            <ItemOrigin goToItemLine={goToItemLine} />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="hidden lg:grid lg:grid-cols-6">
        <div className="col-span-2">
          <ItemLine
            productRecognition={productRecognition}
            goToItemOrigin={goToItemOrigin}
          />
        </div>
        <div className="col-span-4 mt-2">
          <ItemOrigin goToItemLine={goToItemLine} />
        </div>
      </div>
    </section>
  );
}

export default Item;
