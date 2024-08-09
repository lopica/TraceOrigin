import Table from "./UI/Table";
import useProductDetail from "../hooks/use-product-detail";
import Carousel from "./UI/Carousel";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/use-toast";
import Canvas3D from "./Canvas3D";
import { FaPlus, FaUpload } from "react-icons/fa";
import UploadModel3DModal from "../components/UI/UploadModel3DModal";
import ImageUploadModal from "../components/UI/ImageUploadModal";
import {
  useSaveModel3DMutation,
  useRequestScanImageMutation,
} from "../store/apis/productApi";
import { file } from "jszip";
import { convertLinkToBase64 } from "../utils/convertLinkToBase64";


const productConfig = [
  {
    label: "Thông số kĩ thuật",
    icon: (item) => item?.icon,
    render: (item) => item?.label,
  },
  {
    label: "Giá trị",
    render: (item) => item?.value,
  },
];

let renderedProductDetail;
let thumb3D;
export default function ProductDetail({ productId }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [slides, setSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageReports, setImageReports] = useState([]);
  const { getToast } = useToast();
  const { productData, name, images, isProductFetch, isProductError, error, model3D, refetch } =
    useProductDetail(productId,{
      skip: true,
    });
  const [requestScanImage] = useRequestScanImageMutation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [saveModel3D] = useSaveModel3DMutation();

  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (images.length > 0) {
      console.log(model3D);
      if (model3D) {
        // console.log("vod day " + model3D);
        convertLinkToBase64(
          model3D
          // "https://storage.googleapis.com/download/storage/v1/b/storagetraceorigin/o/model3D%2F70.stl?generation=1723209715576471&alt=media"
          // "/model3D_70.stl"
        )
          .then((res) => {
            const imageSlides = images.map((image, idx) => (
              <img src={image} alt={`${name} ${idx}`} />
            ));
            setSlides([
              ...imageSlides,
              <div className="sm:w-[32rem] aspect-video">
                <Canvas3D full modelBase64={res} />
              </div>,
            ]);
            thumb3D = (
              <div className="sm:w-[32rem] aspect-video">
                <Canvas3D modelBase64={res} />
              </div>
            );
          })
          .catch((err) => console.log(err));
      } else {
        const imageSlides = images.map((image, idx) => (
          <img src={image} alt={`${name} ${idx}`} />
        ));
        setSlides([...imageSlides]);
      }
    }
  }, [images, model3D]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleUploadModel3D = async (file3D) => {
    getToast("Hệ thống đang xử lý");
   const formData = {
    productId,
    file3D,
  };
    try {
      await saveModel3D(formData).unwrap();
      getToast("Hệ thống đã tải model 3D thành công");
    } catch (error) {
      console.error(error);
      getToast("Lỗi khi tải model 3D");
    }
    // console.log("Submitted Data:", formData);
    refetch();
  };

  let renderedProductDetail;
  if (isProductFetch) {
    renderedProductDetail = <div className="skeleton h-[40svh] w-full"></div>;
  } else if (isProductError) {
    renderedProductDetail = <p>Lỗi khi tải dữ liệu chi tiết của sản phẩm</p>;
  } else {
    if (productData.length > 0) {
      renderedProductDetail = (
        <div>
          <h1 className="text-center text-4xl mb-4">{name || "no name"}</h1>
          <Table
            data={productData}
            config={productConfig}
            keyFn={(item) => item.label}
          />
          <p className="mt-4 text-center">
            Bạn muốn sản phẩm của bạn dễ dàng truy cập hơn?
            <a
              onClick={handleModalOpen}
              className="text-blue-500 underline cursor-pointer"
            >
              Đăng kí quét hình ảnh sản phẩm
            </a>
          </p>
        </div>
      );
    }
  }

  return (
    <section className="py-6 px-4 md:grid lg:grid-cols-2 gap-6 pb-12">
      <Carousel slides={slides} thumb3D={model3D ? thumb3D : undefined} />
      {renderedProductDetail}
      <button
        onClick={openModal}
        className="add-button w-fit flex items-center p-2 text-green-500 rounded-md hover:bg-green-500 hover:text-white border-2 border-dashed border-green-500"
      >
        <FaUpload className="mr-2" />
        Upload Model 3D
      </button>
      <UploadModel3DModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onSubmit={handleUploadModel3D}
      />
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        imageReports={imageReports}
        productId={productId}
      />
    </section>
  );
}
