import React from "react";

const CustomerInfo = ({
  totalCustomers,
  monthlyCustomers,
  totalLabel,
  monthlyLabel,
}) => {
  return (
    <div className="flex border p-4 bg-white rounded-box mb-2">
      <div className="w-1/2 border-r pr-4 flex flex-col justify-between">
        <div className="text-md font-bold text-gray-500 text-center">
          {totalLabel}
        </div>
        <div className="text-2xl font-bold mt-2 text-center text-green-500">
          {totalCustomers || "--"}
        </div>
      </div>
      <div className="w-1/2 pl-4 flex flex-col justify-between">
        <div className="text-sm font-bold text-gray-500 text-center">
          {monthlyLabel}
        </div>
        <div className="text-2xl font-bold mt-2 text-center text-green-500">
          {monthlyCustomers || "--"}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
