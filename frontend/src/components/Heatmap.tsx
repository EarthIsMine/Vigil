'use client';

import { useState } from 'react';
import { getHeatColor, generateHeatmapData } from '@/lib/heatmap-utils';

interface TooltipData {
  day: string;
  hour: number;
  count: number;
  x: number;
  y: number;
}

interface HeatmapProps {
  data?: number[][];
  days?: string[];
}

const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function Heatmap({ data: externalData, days = DEFAULT_DAYS }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const data = externalData ?? generateHeatmapData();

  const handleMouseEnter = (dayIndex: number, hour: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      day: days[dayIndex],
      hour,
      count: data[dayIndex][hour],
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        {/* Hour labels (x-axis) */}
        <div className="flex ml-10 mb-1.5">
          {HOURS.map((h) => (
            <div key={h} className="flex-1 text-center text-[10px] text-[#8892ab]/60 font-mono">
              {h % 3 === 0 ? `${h.toString().padStart(2, '0')}` : ''}
            </div>
          ))}
        </div>

        {/* Day rows */}
        <div className="flex flex-col gap-[2px]">
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center">
              <div className="w-10 text-right pr-3 text-[11px] text-[#8892ab] font-mono shrink-0">{day}</div>
              <div className="flex flex-1 gap-[2px]">
                {HOURS.map((hour) => {
                  const count = data[dayIndex]?.[hour] ?? 0;
                  return (
                    <div
                      key={hour}
                      className={`flex-1 aspect-square rounded-[3px] ${getHeatColor(count)} cursor-pointer transition-opacity hover:opacity-80 hover:ring-1 hover:ring-white/20`}
                      onMouseEnter={(e) => handleMouseEnter(dayIndex, hour, e)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#1a1f33] border border-white/10 rounded-md px-2.5 py-1.5 shadow-xl pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-[11px] text-white font-medium">
            {tooltip.day} · {tooltip.hour.toString().padStart(2, '0')}:00
          </div>
          <div className="text-[11px] text-[#8892ab]">
            {tooltip.count} attacks
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-[#8892ab]">
        <span>Less</span>
        <div className="flex gap-[2px]">
          <div className="w-3 h-3 bg-white/[0.03] rounded-[2px]" />
          <div className="w-3 h-3 bg-red-500/10 rounded-[2px]" />
          <div className="w-3 h-3 bg-red-500/20 rounded-[2px]" />
          <div className="w-3 h-3 bg-red-500/35 rounded-[2px]" />
          <div className="w-3 h-3 bg-red-500/50 rounded-[2px]" />
          <div className="w-3 h-3 bg-red-500/70 rounded-[2px]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
