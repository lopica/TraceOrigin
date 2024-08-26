import { useSelector } from "react-redux";
import { useFetchOriginByItemLogIdQuery } from "../store";
import Map from "./Map";
import Carousel from "./UI/Carousel";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
import { useEffect, useState } from "react";
import { getWarrantyDate } from "../utils/getWarrantyDate";
import Button from "./UI/Button";
import { IoIosArrowBack } from "react-icons/io";
import {
  FaCalendarAlt,
  FaImages,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";
import QR from "./QR";
import { convertLinkToBase64 } from "../utils/convertLinkToBase64";
import Canvas3D from "./Canvas3D";
import { getFullTimeFromEpoch } from "../utils/getFullTimeFromEpoch";
import useShow from "../hooks/use-show";
import ShowInfoHomePage from "./UI/homepage/ShowInfoHomePage";
import Modal from "./UI/Modal";
import ProductDetail from "./ProductDetail";

let origin;
let thumb3D;
export default function ItemOrigin({ goToItemLine, productRecognition }) {
  const { itemLine } = useSelector((state) => state.itemSlice);
  const [slides, setSlides] = useState([]);
  const { show, handleOpen, handleClose } = useShow();
  const {
    show: showProduct,
    handleOpen: handleOpenProduct,
    handleClose: handleCloseProduct,
  } = useShow();

  // const [thumb3D, setThumb3D] = useState();
  const {
    data: originData,
    isError: isOriginError,
    isFetching: isOriginFetching,
  } = useFetchOriginByItemLogIdQuery(itemLine[0]?.itemLogId, {
    skip: itemLine.length === 0,
  });

  useEffect(() => {
    if (originData) {
      const imageSlides = originData?.image.map((image, idx) => (
        <img src={image} alt={`${name} ${idx}`} />
      ));
      setSlides([...imageSlides]);

      if (originData?.model3D) {
        // console.log("vod day " + model3D);
        convertLinkToBase64(originData.model3D)
          .then((res) => {
            setSlides([
              ...imageSlides,
              <div className="sm:w-[32rem] aspect-video">
                <Canvas3D full modelBase64={res} />
              </div>,
            ]);
            thumb3D = <p>3D</p>;
          })
          .catch((err) => console.log(err));
      } else {
        const imageSlides = originData?.image.map((image, idx) => (
          <img src={image} alt={`${originData?.productName} ${idx}`} />
        ));
        setSlides([...imageSlides]);
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
          {productRecognition && (
            <QR core productRecognition={productRecognition} />
          )}
          <ul className="space-y-2 lg:pb-12 mt-2">
            <li>
              <p>
                <strong>Tên sản phẩm: </strong>
                <Button
                  link
                  className="inline-block p-0"
                  onClick={() => handleOpenProduct()}
                >
                  {originData?.productName || "không rõ"}
                </Button>
              </p>
            </li>
            {/* <li>
              <p>
                <strong>Tên sản phẩm:</strong>{" "}
                {originData.productName || "không rõ"}
              </p>
            </li> */}
            <li>
              {/* <p>Mã sản phẩm: {productRecognition || "không rõ"}</p> */}
            </li>
            <li>
              <p>
                <strong>Đơn vị sản xuất: </strong>
                <Button
                  link
                  className="inline-block p-0"
                  onClick={() => handleOpen()}
                >
                  {originData.orgName.trim() || "không rõ"}
                </Button>
              </p>
            </li>

            {/* <li className="mb-2">
              <p className="">
                <strong>Hình ảnh của sản phẩm:</strong>{" "}
              </p>
              <Carousel
                slides={slides}
                thumb3D={originData?.model3D ? thumb3D : undefined}
              />
            </li> */}

            <li className="flex items-center mt-4">
              <FaCalendarAlt className="mr-2 text-lg" />
              <p>
                <strong>Thời gian: </strong>{" "}
                {getFullTimeFromEpoch(originData.createAt) || "không rõ"}
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
                <strong>Hạn bảo hành:</strong>{" "}
                {getWarrantyDate(originData.createAt, originData.warranty) ||
                  "không rõ"}
              </p>
            </li>
            <li>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-lg" />
                <p className="mb-2">
                  <strong> Địa điểm sản xuất: </strong>{" "}
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
      {showProduct && (
        <Modal onClose={handleCloseProduct}>
          <div className="h-full">
            <ProductDetail productId={originData?.productId} rework />
          </div>
        </Modal>
      )}
      {originData && (
        <ShowInfoHomePage
          rework
          id={originData?.orgNameId}
          isOpen={show}
          onClose={handleClose}
        />
      )}
      <div className="card-body">{origin}</div>
    </div>
  );
}
