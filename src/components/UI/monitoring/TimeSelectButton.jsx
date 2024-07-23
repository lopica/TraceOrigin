// components/TimeSelectButton.jsx
import React from 'react';

const TimeSelectButton = ({ label, icon }) => {
  return (
    <button className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default TimeSelectButton;
