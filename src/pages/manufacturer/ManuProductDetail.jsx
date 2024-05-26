import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

function ManuProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  useEffect(() => {
    async function fetchProduct() {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`
      );
      setProduct(await response.json());
    }
    fetchProduct();
  }, [productId]);

  return (
    <div className="p-4">
      {/* Image Placeholder */}
      <div className="w-full h-52 bg-sky-00 rounded-md flex items-center justify-center mb-4">
        <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-md"></div>
      </div>

      {/* Product Name */}
      <p className="text-center text-lg mb-4">{product?.name || "no name"}</p>

      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Thông số kĩ thuật</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>kích thước</th>
              <td>{product?.size || "Ko rõ"}</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>cân nặng</th>
              <td>{product?.weight || "Ko rõ"}</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>chất liệu</th>
              <td>{product?.material || "Ko rõ"}</td>
            </tr>
            <tr>
              <th>công dụng</th>
              <td>
                {Array.isArray(product.features)
                  ? product.features.join(", ")
                  : "Ko rõ"}
              </td>
            </tr>
            <tr>
              <th>công dụng</th>
              <td>{product?.warranty} năm</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Illustrative Images */}
      <div className="mb-4">
        <p className="mb-2">Các ảnh minh họa</p>

        <div className="flex space-x-4 mb-8">
          <div className="w-20 h-20 bg-sky-200 flex items-center justify-center"></div>
          <div className="w-20 h-20 bg-sky-200 flex items-center justify-center">
            <FaPlus className="text-2xl fill-white" />
          </div>
        </div>
      </div>

      {/* Item List */}
      <div>
        <p className="mb-2">Các item</p>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>Rank</th>
                <th>ID1</th>
                <th>Last Modified</th>
                <th>Last Event</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <div className="mb-2">
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
        </Link> */}
      </div>
    </div>
  );
}

export default ManuProductDetail;
