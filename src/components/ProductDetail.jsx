import Table from "./UI/Table";
import useProductDetail from "../hooks/use-product-detail";
import Carousel from "./UI/Carousel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../hooks/use-toast";

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
  const { getToast } = useToast();
  const {
    productData,
    name,
    images,
    isProductFetch,
    isProductError,
    error,
  } = useProductDetail(productId);

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
      setSlides(
        images.map((image, idx) => (
          <img src={image} alt={`${name} ${idx}`} className="" />
        ))
      );
    }
  }, [images]);

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
        </div>
      );
    }
  }

  return (
    <section className="py-6 px-4 md:grid lg:grid-cols-2 gap-6 pb-12">
      <Carousel slides={slides} />
      {renderedProductDetail}
    </section>
  );
}
