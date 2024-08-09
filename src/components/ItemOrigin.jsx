import { useSelector } from "react-redux";
import { useFetchOriginByItemLogIdQuery } from "../store";
import Map from "./Map";
import Carousel from "./UI/Carousel";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { useEffect, useState } from "react";
import { getWarrantyDate } from "../utils/getWarrantyDate";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import { FaCalendarAlt, FaImages, FaInfoCircle, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

let origin;

export default function ItemOrigin({ goToItemLine }) {
  const { itemLine } = useSelector((state) => state.itemSlice);
  const [slides, setSlides] = useState([]);
  const {
    data: originData,
    isError: isOriginError,
    isFetching: isOriginFetching,
  } = useFetchOriginByItemLogIdQuery(itemLine[0]?.itemLogId, {
    skip: itemLine.length === 0,
  });

  useEffect(() => {
    if (originData?.image) {
      if (originData.image.length > 0) {
        setSlides(
          originData.image.map((image, idx) => (
            <img
              src={image}
              alt={`${originData.productName || "không có"} ${idx}`}
            />
          ))
        );
      }
    }
  }, [originData]);

  if (isOriginFetching) {
    origin = (
      <>
        <div className="skeleton w-full"></div>
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <li key={idx}>
              <div className="skeleton w-full">&#8203;</div>
            </li>
          ))}
          <li>
            <div className="skeleton w-full h-48">&#8203;</div>
          </li>
          {Array.from({ length: 5 }).map((_, idx) => (
            <li key={idx + 3}>
              <div className="skeleton w-full">&#8203;</div>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (isOriginError) {
    origin = <p>Gặp lỗi khi tải dữ liệu về nguồn gốc sản phẩm</p>;
  } else {
    if (originData) {
      origin = (
        <section className="text-xl">
          <h2 className="mb-4 text-center font-bold text-2xl">Nguồn gốc</h2>
          <ul className="space-y-2 lg:pb-12 ">
            <li>
            <p><strong>Tên sản phẩm:</strong> {originData.productName || "không rõ"}</p>
            </li>
            <li>
              {/* <p>Mã sản phẩm: {productRecognition || "không rõ"}</p> */}
            </li>
            <li>
              <p><strong>Đơn vị sản xuất: </strong> {originData.orgName.trim() || "không rõ"}</p>
            </li>
            <li>
              <p className="mb-4"><strong>Hình ảnh của sản phẩm:</strong> </p>
              <Carousel slides={slides} />
            </li>

            <li className="flex items-center">
            <FaCalendarAlt className="mr-2 text-lg" />
              <p>
              <strong>Thời gian tạo: </strong>
                {" "}
                {getDateFromEpochTime(originData.createAt) || "không rõ"}
              </p>
            </li>
            <li className="flex items-center">
            <FaInfoCircle className="mr-2 text-lg" />
              <p>
              <strong>Mô tả sản phẩm: </strong>
                 {originData.descriptionOrigin || "không có"}
              </p>
            </li>
            <li className="flex items-center">
            <FaShieldAlt className="mr-2 text-lg" />
              <p>
              <strong>Hạn bảo hành:</strong>
              {" "}
                {getWarrantyDate(originData.createAt, originData.warranty) ||
                  "không rõ"}
              </p>
            </li>
            <li >
            <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-lg" />
            <p className="mb-2">
              <strong> Địa điểm sản xuất: </strong>
               {" "}
                {`${originData.locationDTO.address}, ${originData.locationDTO.ward}, ${originData.locationDTO.district}, ${originData.locationDTO.city} `}
              </p>
            </div>
             
              <Map
                location={{
                  lat: originData.locationDTO.coordinateX,
                  lng: originData.locationDTO.coordinateY,
                }}
              />
            </li>
          </ul>
        </section>
      );
    }
  }

  return (
    <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-white mb-8 mx-2 mt-4 lg:max-h-[88svh] overflow-y-auto lg:mb-0">
      <div className="mt-5 ml-4 lg:hidden">
        <Button primary outline onClick={goToItemLine}>
          <IoIosArrowBack /> Quay lại
        </Button>
      </div>
      <div className="card-body">{origin}</div>
    </div>
  );
}
