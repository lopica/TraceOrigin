import React from "react";

const CustomerCareInfo = ({
  done,
  cancel,
  waiting
}) => {
  return (
<div className="flex flex-col justify-center items-center  border p-2 bg-white rounded-box mb-2 w-fit">
{cancel ? (
  <div className="flex">
    <div className="w-1/3 border-r px-2 flex flex-col justify-between">
      <div className="text-md font-bold  text-center text-green-500">
        {done}
      </div>
    </div>
    <div className="w-1/3 border-r px-2 flex flex-col justify-between">
      <div className="text-md font-bold  text-center text-red-500">
        {cancel}
      </div>
    </div>
    <div className="w-1/3 flex px-2 flex-col justify-between">
      <div className="text-md font-bold  text-center text-yellow-400">
        {waiting}
      </div>
    </div>
  </div>
):(
  <div className="flex">
    <div className="w-1/2 border-r px-2 flex flex-col justify-between">
      <div className="text-md font-bold  text-center text-green-500">
        {done}
      </div>
    </div>
  
    <div className="w-1/2 flex px-2 flex-col justify-between">
      <div className="text-md font-bold  text-center text-yellow-400">
        {waiting}
      </div>
    </div>
  </div>
)}
</div>

  );
};

export default CustomerCareInfo;
