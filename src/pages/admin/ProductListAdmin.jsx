import React from 'react';
import { useDisableProductByIdMutation, useCheckStatusMutation } from "../../store/apis/productApi";

const ProductListAdmin = ({ data = [], refetch}) => {
  const [disableProductById] = useDisableProductByIdMutation();
  const [checkStatus] = useCheckStatusMutation();

  const handleDisable = async (id) => {
    try {
      const statusMessage = await checkStatus(id).unwrap();
      if (statusMessage === "1") {
        alert("Sản phẩm đã được khóa trước đó.");
      } else if (statusMessage === "2") {
        await disableProductById(id).unwrap();
        alert("Sản phẩm đã được khóa thành công.");
        refetch();
      } else {
        alert("Không có item");
      }
    } catch (error) {
      alert("Không có item ");
    }
  };

  const handleEnable = async (id) => {
    try {
      const statusMessage = await checkStatus(id).unwrap();
      if (statusMessage === "1") {
        await disableProductById(id).unwrap();
        alert("Sản phẩm đã được mở khóa thành công.");
        refetch();
      } else if (statusMessage === "2") {
        alert("Sản phẩm chưa bị khóa.");
      } else {
        alert("Không có item");
      }
    } catch (error) {
      alert("Không có item");
    }
  };

  return (
    <div>
      {data.map((product, index) => (
        <div
          key={product.productId}
          className={`flex p-2 w-full ${index === data.length - 1 ? '' : 'border-b border-gray-200'} justify-between`}
        >
          <div className='flex items-center'>
            <img
              src={product.avatar}
              alt={product.productName}
              className="w-10 h-10 object-cover rounded-full mr-4"
            />
            <div>
              <h3 className="text-md font-bold w-full">{product.productName}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          </div>

          <div className='flex space-x-2'>
            <button
              className='btn btn-error btn-sm'
              onClick={() => handleDisable(product.productId)}
              disabled={product.checkStatusDisable === 1} 
            >
              Khóa
            </button>
            <button
              className='btn btn-success btn-sm'
              onClick={() => handleEnable(product.productId)}
              disabled={product.checkStatusDisable === 0} 
            >
              Mở khóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListAdmin;
