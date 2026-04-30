'use client';

import { useState } from 'react';
import { getColorClass, generateHeatmapData } from '@/lib/heatmap-utils';

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

export default function Heatmap({ data: externalData, days = DEFAULT_DAYS }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const data = externalData ?? generateHeatmapData();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleMouseEnter = (dayIndex: number, hour: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      day: days[dayIndex],
      hour,
      count: data[dayIndex][hour],
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative">
      <div className="flex">
        {/* Hour labels */}
        <div className="flex flex-col pr-2">
          <div className="h-6" />
          {hours.filter(h => h % 3 === 0).map((hour) => (
            <div
              key={hour}
              className="text-xs text-[#8892ab] text-right"
              style={{ height: `${24 * 3}px`, lineHeight: `${24 * 3}px` }}
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex-1">
          {/* Day labels */}
          <div className="flex mb-2">
            {days.map((day) => (
              <div key={day} className="flex-1 text-center text-xs text-[#8892ab]">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, dayIndex) => (
              <div key={day} className="flex flex-col gap-1">
                {hours.map((hour) => {
                  const count = data[dayIndex]?.[hour] ?? 0;
                  return (
                    <div
                      key={hour}
                      className={`w-full h-6 rounded ${getColorClass(count)} cursor-pointer transition-all hover:ring-2 hover:ring-[#ef4444]/50`}
                      onMouseEnter={(e) => handleMouseEnter(dayIndex, hour, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#0a0e1a] border border-white/20 rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="text-xs font-medium">{tooltip.day}</div>
          <div className="text-xs text-[#8892ab]">
            {tooltip.hour.toString().padStart(2, '0')}:00
          </div>
          <div className="text-sm font-bold text-[#ef4444] mt-1">
            {tooltip.count} attacks
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-[#8892ab]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-[#1a1f2e] rounded" />
          <div className="w-4 h-4 bg-[#ef4444]/20 rounded" />
          <div className="w-4 h-4 bg-[#ef4444]/40 rounded" />
          <div className="w-4 h-4 bg-[#ef4444]/60 rounded" />
          <div className="w-4 h-4 bg-[#ef4444] rounded" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
