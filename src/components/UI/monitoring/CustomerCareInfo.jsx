import React from "react";

const CustomerCareInfo = ({
  done,
  cancel,
  waiting
}) => {
  return (
<div className="flex flex-col justify-center items-center  border p-2 bg-white rounded-box w-fit">
{cancel ? (
  <div className="flex">
  <div className="w-1/3 border-r px-2 flex items-center justify-between">
    <div className="text-xs text-gray-700 mr-2 whitespace-nowrap overflow-visible text-ellipsis">
      Đã xử lý
    </div>
    <div className="text-md font-bold text-green-500">{done}</div>
  </div>
  
  <div className="w-1/3 border-r px-2 flex items-center justify-between">
    <div className="text-xs text-gray-700 mr-2 whitespace-nowrap overflow-visible text-ellipsis">
      Chưa xử lý
    </div>
    <div className="text-md font-bold text-red-500">{cancel}</div>
  </div>
  
  <div className="w-1/3 px-2 flex items-center justify-between">
    <div className="text-xs text-gray-700 mr-2 whitespace-nowrap overflow-visible text-ellipsis">
      Chờ xử lý
    </div>
    <div className="text-md font-bold text-yellow-400">{waiting}</div>
  </div>
</div>
):(
  <div className="flex">
  <div className="w-1/2 px-2 flex items-center justify-between">
    <div className="text-xs text-gray-700 mr-2 whitespace-nowrap overflow-visible text-ellipsis">
      Đã xử lý
    </div>
    <div className="text-md font-bold text-green-500">{done}</div>
  </div>
  
    <div className="w-1/2 px-2 flex items-center justify-between">
    <div className="text-xs text-gray-700 mr-2 whitespace-nowrap overflow-visible text-ellipsis">
      Chờ xử lý
    </div>
    <div className="text-md font-bold text-yellow-400">{waiting}</div>
  </div>
  </div>
)}
</div>

  );
};

export default CustomerCareInfo;
