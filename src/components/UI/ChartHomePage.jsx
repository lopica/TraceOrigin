import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetNumberVisitsDiagramQuery } from '../../store/apis/elkApi';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const ChartHomePage = ({ className }) => {
  const { data: apiData, error, isLoading } = useGetNumberVisitsDiagramQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const jsonData = apiData ? JSON.parse(apiData) : [];

  const labels = jsonData.map(data => data.formatted_date);
  const dataValues = jsonData.map(data => data.doc_count);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'số người truy xuất nguồn gốc',
        data: dataValues,
        fill: false,
        borderColor: 'rgba(43, 117, 245)',
        tension: 0.1,
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
    },
  };

return (
  <div className={`w-full h-full ${className}`}>
      <Line data={data} options={options} />
</div>
  );
};

export default ChartHomePage;
