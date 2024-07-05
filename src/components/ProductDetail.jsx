import Table from "./UI/Table";
import useProductDetail from "../hooks/use-product-detail";
import ImageBox from "./UI/ImageBox";
import { useForm } from "react-hook-form";
import Carousel from "./UI/Carousel";

let renderedProductDetail;
export default function ProductList({ productId }) {
  const {
    productData,
    productConfig,
    name,
    images,
    isProductFetch,
    isProductError,
  } = useProductDetail(productId);
  const { setValue } = useForm({ mode: "onTouched" });

  if (isProductFetch) {
    renderedProductDetail = <div className="skeleton h-[40svh] w-full"></div>;
  } else if (isProductError) {
    renderedProductDetail = <p>Lỗi khi tải dữ liệu chi tiết của sản phẩm</p>;
  } else {
    if (productData.length > 0) {
      renderedProductDetail = (
        <div>
          <h1 className="text-center text-lg mb-4">{name || "no name"}</h1>
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
    <section className="py-6 px-4 md:grid lg:grid-cols-2 gap-6 pb-28">
      <Carousel images={images} />
      {renderedProductDetail}
    </section>
  );
}
