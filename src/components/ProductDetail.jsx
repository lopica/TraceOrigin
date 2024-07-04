import Table from "./UI/Table";
import useProductDetail from "../hooks/use-product-detail";
import ImageBox from "./UI/ImageBox";
import { useForm } from "react-hook-form";
import Carousel from "./UI/Carousel";

export default function ProductList({ productId }) {
  const { productData, productConfig, name, images } =
    useProductDetail(productId);
  const { setValue } = useForm({ mode: "onTouched" });
  return (
    <section className="py-6 px-4 md:grid lg:grid-cols-2 gap-6 pb-28">
      <Carousel images={images} />
      <div>
      <h1 className="text-center text-lg mb-4">{name || "no name"}</h1>
      <Table
        data={productData}
        config={productConfig}
        keyFn={(item) => item.label}
      />
      </div>
    </section>
  );
}
