import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUsers, FaQrcode, FaRegRegistered } from "react-icons/fa";
import { useGetNumberVisitsAllTimeQuery } from "../../../store/apis/elkApi";
import { useCountRegisteredProductQuery } from "../../../store/apis/productApi";
import { useCountRegisteredUserQuery } from "../../../store/apis/userApi";

// import SockJS from 'sockjs-client';
// import SockJS from "sockjs-client/dist/sockjs"

import { over } from "stompjs";
import Top5Carousel from "./Top5Carousel";
var stompClient = null;

const CarouselHomePage = () => {
  // const [data, setData] = useState({
  //   numberClient: "--",
  //   numberTrace: "--",
  //   numberRegisterProduct: "--"
  // });

  const { data: number1 } = useCountRegisteredUserQuery();
  const { data: number2 } = useGetNumberVisitsAllTimeQuery();
  const { data: number3 } = useCountRegisteredProductQuery();

  // ================socket
  // useEffect(() => {
  //   let Sock = new SockJS("https://traceorigin.click/ws");
  //   stompClient = over(Sock);
  //   stompClient.connect({}, onConnected, onError);
  // }, []);

  // const onConnected = () => {

  //   stompClient.subscribe('/topic/messages', onMessageReceived);

  // };
  // const onMessageReceived = (payload) => {
  //   var payloadData = JSON.parse(payload.body);
  //   setData(payloadData);

  // };

  // const onError = () => {};

  return (
    <div className="hidden sm:block w-full max-w-full mx-auto p-6">
      <div className="max-w-4xl mx-auto px-4 py-8 ">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl font-bold  text-yellow-400 text-left">
            <span className="block">HỆ THỐNG</span>
            <span className="block">TRUY XUẤT NGUỒN GỐC</span>
          </h1>
        </div>
        <p className="text-lg text-white text-justify mb-8">
          Giải pháp dành cho tất cả mọi người thực hiện truy xuất nguồn gốc sản
          phẩm nhằm tăng giá trị và sự khác biệt so với các sản phẩm khác trên
          thị trường. Chứng nhận về chất lượng, nguồn.
        </p>
        {/* thông số  */}
        <div className="flex justify-center gap-4">
          <div className=" bg-color1 text-white p-4 rounded-box flex items-center space-x-4 ">
            <FaUsers className="text-3xl" />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">
                {number1 !== undefined && number1 !== null ? number1 : "--"}
              </p>
              <h2 className="text-sm \text-center">Đối tác và khách hàng</h2>
            </div>
            <div className="mx-4 border-l-2 border-white h-16"></div>
            <FaQrcode className="text-3xl" />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">
                {number2 !== undefined && number2 !== null ? number2 : "--"}
              </p>
              <h2 className="text-sm text-center">Lượt truy xuất nguồn gốc</h2>
            </div>
            <div className="mx-4 border-l-2 border-white h-16"></div>
            <FaRegRegistered className="text-3xl" />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">
                {number3 !== undefined && number3 !== null ? number3 : "--"}
              </p>
              <h2 className="text-sm text-center">Sản phẩm được đăng ký</h2>
            </div>
          </div>
        </div>
        <Top5Carousel />
      </div>
    </div>
  );
};

export default CarouselHomePage;
