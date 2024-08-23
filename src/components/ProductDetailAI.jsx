// ProductDetailAI.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductDetailAI = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (productId && !isNaN(productId)) {
      const url = `http://localhost:8080/api/product/getInfoByProductId?productId=${productId}&timestamp=${new Date().getTime()}`;
      
      axios.get(url)
        .then((res) => {
          setProduct(res.data);
          setConfidence(res.data.confidence || 0);
        })
        .catch((err) => {
          console.error("Error fetching product information:", err);
        });
    }
  }, [productId]);

  if (!product) {
    return null;
  }

  return (
    <div className="flex-1 w-1/2 p-4">
      {product.productName ? (
        <>
          <h3 className="text-center text-3xl mb-6">{product.productName}</h3>
          <div className="flex justify-between max-w-md mx-auto">
            <div className="flex flex-col">
              <div className="stat-title">Độ chính xác</div>
              <div className="font-medium">{confidence.toFixed(2)}%</div>
            </div>
          </div>
          <div className="flex flex-col">
            <p><strong>Tên sản phẩm:</strong> {product.productName}</p>
            <p><strong>Loại sản phẩm:</strong> {product.categoryName}</p>
            <p><strong>Tên nhà sản xuát:</strong> {product.nameManufacturer}</p>
            <Link
              to={`/portal/detail/${product.userId}`}
              className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaInfoCircle className="mr-2" size={20} />
              Chi tiết nhà sản xuất
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-white text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600">
            Hãy chắc chắn rằng sản phẩm được cung cấp tính năng quét bằng AI.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetailAI;
