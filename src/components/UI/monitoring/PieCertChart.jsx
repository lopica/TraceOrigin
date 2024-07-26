import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieCertChart = ({ data = [] }) => {
  console.log(data.countPoint+ "mmm");
  const chartData = {
    labels: ['Lượt người điền đầy đủ', 'Lượt người điền không đầy đủ'],
    datasets: [
      {
        label: 'Ratio Task',
        data: [data.countPoint, (data.countItemLog - data.countPoint)],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',

        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieCertChart;
