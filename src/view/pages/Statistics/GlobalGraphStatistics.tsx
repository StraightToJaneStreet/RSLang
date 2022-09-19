import React from 'react';

import { FC } from 'react';
import { DailyStatistics } from '../../../core/Statistics';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export type GraphGameStatisticsProps = {
  statistics: { [k: string]: DailyStatistics };
};

const GlobalGameStatistics: FC<GraphGameStatisticsProps> = ({ statistics }) => {

  const labels = Object.keys(statistics);

  const data = {
    labels,
    datasets: [
      {
        label: 'Количество новых слов за каждый день',
        data: labels.map((day) => statistics[day].totalWordsCount),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Увеличение количества изученных слов за весь период обучения',
        data: labels.map((day) => statistics[day].learnedWordsCount),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Два графика сумарной статистики по дням за все время',
      },
    },
  };

  return (
      <Bar options={options} data={data} />
  );
};

export default GlobalGameStatistics;