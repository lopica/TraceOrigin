import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, ChartDataLabels); // Register the plugin

import { useGetNumberVisitsDiagramQuery } from '../../store/apis/elkApi';
import TimeSelect from './monitoring/TimeSelect';

const ChartVisit = ({selectedTime}) => {

  const { data: apiData, error, isLoading } = useGetNumberVisitsDiagramQuery(selectedTime);
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const jsonData = apiData ? JSON.parse(apiData) : [];

  const labels = jsonData.map(data => data.formatted_date);
  const dataValues = jsonData.map(data => data.doc_count);

  const data = {
    labels: labels,
    datasets: [
      {
           borderWidth: 1,
        label: 'số người truy xuất nguồn gốc',
        data: dataValues,
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: '',
      },
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        color: '#666', 
        font: {
          weight: 'normal', 
          size: 10,
        },
        formatter: (value) => value,
        padding: 6,
        backgroundColor: 'rgba(255, 255, 255)', 
        borderRadius: 4, 
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full h-full mb-4">
        <Line data={data} options={options} />
  </div>
  );
};

export default ChartVisit;
