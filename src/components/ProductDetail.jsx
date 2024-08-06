import Table from "./UI/Table";
import useProductDetail from "../hooks/use-product-detail";
import Carousel from "./UI/Carousel";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/use-toast";
import Canvas3D from "./Canvas3D";
import ImageBox from "../components/UI/ImageBox";
import { FaPlus, FaUpload } from "react-icons/fa";
import UploadModel3DModal from "../components/UI/UploadModel3DModal";
import { useSaveModel3DMutation } from "../store/apis/productApi";

const productConfig = [
  {
    label: "Thông số kĩ thuật",
    icon: (item) => item?.icon,
    render: (item) => item?.label,
    // sortValue: (item) => item?.label,
  },
  {
    label: "Giá trị",
    render: (item) => item?.value,
  },
];

let renderedProductDetail;
export default function ProductDetail({ productId }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [slides, setSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageReports, setImageReports] = useState([]);
  const { getToast } = useToast();
  const fileInputRef = useRef(null);
  const { productData, name, images, isProductFetch, isProductError, error } =
    useProductDetail(productId);

  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [isProductError]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên dăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (images.length > 0) {
      const imageSlides = images.map((image, idx) => (
        <img src={image} alt={`${name} ${idx}`} />
      ));
      setSlides([
        ...imageSlides,
        <div className="sm:w-[32rem] aspect-video">
          <Canvas3D full />
        </div>,
      ]);
    }
  }, [images]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (event) => {};

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFatherDelete = (index) => {
    const newReports = imageReports.filter((_, i) => i !== index);
    setImageReports(newReports);
  };

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
            Bạn muốn sản phẩm của bạn dễ dàng truy cập hơn?{" "}
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
  // ================================================ add model 3D
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [saveModel3D] = useSaveModel3DMutation();

  const handleUploadModel3D = async (file3D) => {
    getToast("Hệ thống đang xử lý");
    const formData = {
      id: productId,
      file3D: file3D
   };
    try {
      await saveModel3D(formData).unwrap();
      getToast("Hệ thống đã tiếp nhận đơn của bạn");
    } catch (error) {
      console.error(error);
    }
    console.log("Submitted Data:", formData);


  };
  return (
    <section className="py-6 px-4 md:grid lg:grid-cols-2 gap-6 pb-12">
      <Carousel
        slides={slides}
        thumb3D={
          <div className="sm:w-[32rem] aspect-video">
            <Canvas3D />
          </div>
        }
      />
      {renderedProductDetail}
      {/* // ================================================ add model 3D */}
      <button
        onClick={openModal}
        className="add-button w-fit flex items-center p-2  text-green-500 rounded-md hover:bg-green-500 hover:text-white border-2 border-dashed border-green-500"
      >
        <FaUpload className="mr-2" />
        Upload Model 3D
      </button>
      <UploadModel3DModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onSubmit={handleUploadModel3D}
      />
        {/* ================================================  */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={handleModalClose}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Tải lên hình ảnh nhận diện
            </h2>
            <p className="mb-4">
              Vui lòng tải lên tối thiểu 16 ảnh. Ảnh nên được chụp ở nơi sáng và
              rõ nét để đảm bảo chất lượng tốt nhất.
            </p>
            <div className="flex flex-wrap gap-4">
              {imageReports.map((image, i) => (
                <div key={i}>
                  <ImageBox
                    image={`data:image/png;base64,${image}`}
                    show
                    isReport={true}
                    handleFatherDelete={() => handleFatherDelete(i)}
                    setValue={setValue}
                    className="min-w-24 min-h-24 max-w-24 max-h-24"
                    idx={i}
                  />
                </div>
              ))}
            </div>
            <div
              className="hover:cursor-pointer bg-sky-200 flex items-center justify-center min-w-24 min-h-24 max-w-24 max-h-24"
              onClick={triggerFileInput}
            >
              <FaPlus className="text-2xl fill-white" />
              <input
                ref={fileInputRef}
                name="images"
                type="file"
                className="file-input hidden"
                accept="image/png, image/gif, image/jpeg"
                multiple
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
