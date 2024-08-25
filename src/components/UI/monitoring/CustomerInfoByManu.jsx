import React from "react";

const CustomerInfoByManu = ({
  numberProduct,
  numberCode,
  type,
}) => {
  return (
<div className="flex flex-col border p-4 bg-white rounded-box mb-2 w-full">
  <div className="text-md font-bold text-gray-500 text-center mb-4">
    {type}
  </div>
  <div className="flex">
    <div className="w-1/2 border-r pl-4 pr-4 flex flex-col justify-between">
      <div className="text-sm text-gray-500 text-center">
       Sản phẩm
      </div>
      <div className="text-2xl font-bold mt-2 text-center text-green-500">
        {numberProduct || "--"}
      </div>
    </div>
    <div className="w-1/2 pl-4 flex flex-col justify-between">
      <div className="text-sm text-gray-500 text-center">
        Mã QR
      </div>
      <div className="text-2xl font-bold mt-2 text-center text-green-500">
        {numberCode || "--"}
      </div>
    </div>
  </div>
</div>

  );
};

export default CustomerInfoByManu;
