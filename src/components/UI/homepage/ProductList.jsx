import React from 'react';

const ProductList = ({ data = [] }) => (
  <div>
    {data.map((product, index) => (
      <div
        key={product.productId}
        className={`flex items-center p-2 w-full ${index === data.length - 1 ? '' : 'border-b border-gray-200'}`}
      >
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
    ))}
  </div>
);

export default ProductList;
