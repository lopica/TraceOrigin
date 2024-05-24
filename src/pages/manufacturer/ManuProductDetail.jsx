import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

function ManuProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(`http://localhost:3000/products/${productId}`);
      setProduct(await response.json());
    }
    fetchProduct();
  }, []);

  return (
    <div className="p-4">
      {/* Image Placeholder */}
      <div className="w-full h-52 bg-sky-00 rounded-md flex items-center justify-center mb-4">
        <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-md"></div>
      </div>

      {/* Product Name */}
      <p className="text-center text-lg mb-4">{product?.name || "no name"}</p>

      {/* Product Details Table */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-green-400 table-auto">
          <tbody>
            <tr>
              <td className="border border-green-400 p-2">kích thước</td>
              <td className="border border-green-400 p-2">
                {product?.size || "Ko rõ"}
              </td>
            </tr>
            <tr>
              <td className="border border-green-400 p-2">cân nặng</td>
              <td className="border border-green-400 p-2">
                {product?.weight || "Ko rõ"}
              </td>
            </tr>
            <tr>
              <td className="border border-green-400 p-2">chất liệu</td>
              <td className="border border-green-400 p-2">
                {product?.material || "Ko rõ"}
              </td>
            </tr>
            <tr>
              <td className="border border-green-400 p-2">công dụng</td>
              <td className="border border-green-400 p-2">
                {Array.isArray(product.features)
                  ? product.features.join(", ")
                  : "Ko rõ"}
              </td>
            </tr>
            <tr>
              <td className="border border-green-400 p-2">bảo hành</td>
              <td className="border border-green-400 p-2">
                {product?.warranty} năm
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Illustrative Images */}
      <div className="mb-4">
        <p className="mb-2">Các ảnh minh họa</p>
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-sky-00 flex items-center justify-center"></div>
          <div className="w-20 h-20 bg-sky-00 flex items-center justify-center">
            <FaPlus className="text-2xl fill-white" />
          </div>
        </div>
      </div>

      {/* Item List */}
      <div>
        <p className="mb-2">Các item</p>
        <div className="mb-2">
          <Link to="/item1">
            <button className="w-full bg-blue-200 p-2 rounded-md text-left">
              item 1
            </button>
          </Link>
        </div>
        <Link to="/create-item">
          <button className="w-full border-dashed border-2 border-green-400 p-2 text-center rounded-md">
            tạo item mới
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ManuProductDetail;
