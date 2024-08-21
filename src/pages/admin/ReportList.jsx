import React from 'react';
import {
    FaExclamationCircle,
    FaQuestionCircle,
  } from "react-icons/fa";
const typeOptions = [
    {
      value: 1,
      icon: <FaExclamationCircle className="text-red-500" />,
      label: "Lỗi",
    },
    {
      value: 2,
      icon: <FaQuestionCircle className="text-blue-500" />,
      label: "Hỏi đáp",
    },
  ];
  

const getTypeIcon = (type) => {
    const typeOption = typeOptions.find((option) => option.value === type);
    return typeOption ? typeOption.icon : null;
  };

const ReportList = ({data = []}) => (
  <div>
    {data.map((report, index) => (
      <div
        key={report.id}
        className={`flex items-center p-2 w-full ${index === data.length - 1 ? '' : 'border-b border-gray-200'}`}
      >
        <div className="mr-1">
                  {getTypeIcon(report.type)}
        </div>
        <div>
          <h3 className="text-md font-bold w-full">{"["} {report.code} {"] "} {report.title}</h3>
          <p className="text-sm text-gray-600">{report.itemId} - {report.productName}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ReportList;
