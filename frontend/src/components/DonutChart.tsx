'use client';

import { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin, TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  labels?: string[];
  data?: number[];
  colors?: string[];
  centerText?: string;
  centerSubText?: string;
}

const DEFAULT_LABELS = ['Sandwich', 'Arbitrage', 'Liquidation'];
const DEFAULT_DATA = [60, 25, 15];
const DEFAULT_COLORS = ['#ef4444', '#f97316', '#a855f7'];

export default function DonutChart({
  labels = DEFAULT_LABELS,
  data = DEFAULT_DATA,
  colors = DEFAULT_COLORS,
  centerText = '0',
  centerSubText = 'total attacks',
}: DonutChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const centerTextRef = useRef(centerText);
  const centerSubTextRef = useRef(centerSubText);
  centerTextRef.current = centerText;
  centerSubTextRef.current = centerSubText;

  const centerTextPlugin: Plugin<'doughnut'> = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();

      const text = centerTextRef.current;
      const subText = centerSubTextRef.current;

      const fontSize = height / 160;
      ctx.font = `bold ${fontSize.toFixed(2)}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2 - 10;
      ctx.fillText(text, textX, textY);

      ctx.font = `${(fontSize * 0.5).toFixed(2)}em sans-serif`;
      ctx.fillStyle = '#8892ab';
      const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
      const subTextY = height / 2 + 15;
      ctx.fillText(subText, subTextX, subTextY);

      ctx.save();
    },
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
          font: { size: 12 },
          usePointStyle: true,
          pointStyle: 'circle' as const,
        },
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
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}% (${value} attacks)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center" style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
}
