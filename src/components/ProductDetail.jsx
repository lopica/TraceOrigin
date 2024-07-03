import Table from "./UI/Table";
import useProductDetail from "../hooks/use-product-detail";
import ImageBox from "./UI/ImageBox";
import { useForm } from "react-hook-form";

export default function ProductList({ productId }) {
  const { productData, productConfig, name, images } =
    useProductDetail(productId);
  const { setValue } = useForm({ mode: "onTouched" });
  return (
    <section>
      <p className="text-center text-lg mb-4">{name || "no name"}</p>
      <Table
        data={productData}
        config={productConfig}
        keyFn={(item) => item.label}
      />
      <div className="mb-4 md:mt-4 xl:mt-6">
        <p className="mb-2 xl:ml-4">Các ảnh minh họa</p>

        <div className="flex space-x-4 mb-8 xl:ml-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4  2xl:grid-cols-5 gap-4 justify-items-center">
            {images.map((image, i) => (
              <div key={i}>
                <ImageBox
                  image={image}
                  show
                  setValue={setValue}
                  className="min-w-24 min-h-24 max-w-24 max-h-24 "
                  idx={i}
                />
              </div>
            ))}

            {images.length < 5 && (
              <ImageBox
                add
                setValue={setValue}
                name="images"
                className="min-w-24 min-h-24 max-w-24 max-h-24"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
