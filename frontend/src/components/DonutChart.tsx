'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart() {
  const data = {
    labels: ['Sandwich', 'Arbitrage', 'Liquidation'],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ['#ef4444', '#f97316', '#a855f7'],
        borderColor: ['#ef4444', '#f97316', '#a855f7'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  // Plugin to draw center text
  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();

      const fontSize = height / 160;
      ctx.font = `bold ${fontSize.toFixed(2)}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      const text = '4,745';
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2 - 10;
      ctx.fillText(text, textX, textY);

      ctx.font = `${(fontSize * 0.5).toFixed(2)}em sans-serif`;
      ctx.fillStyle = '#8892ab';
      const subText = 'total attacks';
      const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
      const subTextY = height / 2 + 15;
      ctx.fillText(subText, subTextX, subTextY);

      ctx.save();
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0a0e1a',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#8892ab',
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            const count = Math.round((value / 100) * 4745);
            return `${label}: ${percentage}% (${count} attacks)`;
          }
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ height: '300px' }}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}
