import React from 'react';

const TimeSelect = ({ value, onChange }) => {
  return (
    <div className="relative inline-block w-fit">
      <select
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="now-15m">15 phút</option>
        <option value="now/h">1 giờ</option>
        <option value="now/d">1 ngày</option>
        <option value="now/w">1 tuần</option>
        <option value="now/M">1 tháng</option>
      </select>
    </div>
  );
};

export default TimeSelect;
