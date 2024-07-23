import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const ChartTransport = ({ data = [] }) => {
  // Sắp xếp dữ liệu giảm dần dựa trên giá trị
  const sortedData = data.slice().sort((a, b) => b.value - a.value);

  const chartData = {
    labels: sortedData.map(item => item.shortKey),
    datasets: [
      {
        label: 'Số lượng nhà cung cấp vận chuyển sử dụng',
        data: sortedData.map(item => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const key = sortedData[context.dataIndex].key; // Access key from sorted data
            return `${datasetLabel}: ${context.raw} (${key})`; // Display key in tooltip
          },
        },
      },
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        color: '#666', // Gray color for the font
        font: {
          weight: 'normal', // Normal font weight
          size: 10,
        },
        padding: 4,
        formatter: (value) => value,
        backgroundColor: 'rgba(255, 255, 255)', // Optional: background color for labels
        borderRadius: 4, // Optional: rounded corners for label background
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='h-full w-full'>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartTransport;
