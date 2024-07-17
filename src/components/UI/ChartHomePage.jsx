
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const jsonData = [
  {
      "doc_count": 8,
      "formatted_date": "16:00",
      "key": 1721120400000
  },
  {
      "doc_count": 70,
      "formatted_date": "17:00",
      "key": 1721124000000
  },
  {
      "doc_count": 123,
      "formatted_date": "18:00",
      "key": 1721127600000
  },
  {
      "doc_count": 142,
      "formatted_date": "19:00",
      "key": 1721131200000
  },
  {
      "doc_count": 0,
      "formatted_date": "20:00",
      "key": 1721134800000
  },
  {
      "doc_count": 0,
      "formatted_date": "21:00",
      "key": 1721138400000
  },
  {
      "doc_count": 12,
      "formatted_date": "22:00",
      "key": 1721142000000
  }
];

const labels = jsonData.map(data => data.formatted_date);
const dataValues = jsonData.map(data => data.doc_count);

const data = {
    labels: labels,
    datasets: [
        {
            label: 'số người truy xuất nguồn gốc',
            data: dataValues,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
        }
    ]
};
// call cho t 2 api này nhé 
// https://traceorigin.click/api/elk/getNumberVisitsDiagram
// https://traceorigin.click/api/elk/getNumberVisitsAllTime

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Document Count Over Time'
        }
    }
};

const ChartHomePage = ({ className }) => {
  return (
    <div className={`w-full h-full ${className}`}>
        <Line data={data} options={options} />
</div>
  );
};

export default ChartHomePage;
