import { useSelector } from "react-redux";
import { useFetchOriginByItemLogIdQuery } from "../store";
import Map from "./Map";
import Carousel from "./UI/Carousel";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { useEffect, useState } from "react";
import { getWarrantyDate } from "../utils/getWarrantyDate";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";

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
              alt={`${originData.productName || "không rõ"} ${idx}`}
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
          <ul className="space-y-2 lg:pb-12">
            <li>
              <p>Tên sản phẩm: {originData.productName || "không rõ"}</p>
            </li>
            <li>
              {/* <p>Mã sản phẩm: {productRecognition || "không rõ"}</p> */}
            </li>
            <li>
              <p>Đơn vị sản xuất: {originData.orgName.trim() || "không rõ"}</p>
            </li>
            <li>
              <p className="mb-4">Các hình ảnh của sản phẩm: </p>
              <Carousel slides={slides} />
            </li>

            <li>
              <p>
                Thời gian tạo:{" "}
                {getDateFromEpochTime(originData.createAt) || "không rõ"}
              </p>
            </li>
            <li>
              <p>
                Mô tả sản phẩm: {originData.descriptionOrigin || "không rõ"}
              </p>
            </li>
            <li>
              <p>
                Hạn bảo hành:{" "}
                {getWarrantyDate(originData.createAt, originData.warranty) ||
                  "không rõ"}
              </p>
            </li>
            <li>
              <p className="mb-2">
                Địa điểm sản xuất:{" "}
                {`${originData.locationDTO.address}, ${originData.locationDTO.ward}, ${originData.locationDTO.district}, ${originData.locationDTO.city} `}
              </p>
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
    <div className="card w-[95svw] sm:w-[640px] sm:mx-auto bg-base-100 shadow-xl border mb-8 mx-2 lg:max-h-[88svh] overflow-y-auto lg:mb-0">
      <div className="mt-5 ml-4 lg:hidden">
        <Button primary outline onClick={goToItemLine}>
          <IoIosArrowBack /> Quay lại
        </Button>
      </div>
      <div className="card-body">{origin}</div>
    </div>
  );
}
