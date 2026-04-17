'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function MevChart() {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Generate 24 hours of data
  const labels = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i));
    return hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });

  const dataValues = Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 150000) + 50000
  );

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(173, 198, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(173, 198, 255, 0.0)');

    chart.data.datasets[0].backgroundColor = gradient;
    chart.update();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'MEV Extracted (USD)',
        data: dataValues,
        borderColor: '#adc6ff',
        backgroundColor: 'rgba(173, 198, 255, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#adc6ff',
        pointHoverBorderColor: '#0a0e1a',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1f33',
        titleColor: '#c8d0e6',
        bodyColor: '#c8d0e6',
        borderColor: '#384460',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return '$' + context.parsed.y.toLocaleString();
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#8892ab',
          maxTicksLimit: 8,
          font: {
            family: 'JetBrains Mono',
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#1a1f33',
          drawBorder: false,
        },
        ticks: {
          color: '#8892ab',
          callback: function (value: any) {
            return '$' + (value / 1000) + 'K';
          },
          font: {
            family: 'JetBrains Mono',
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="h-[400px]">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
