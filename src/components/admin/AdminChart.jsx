import React, { useState } from 'react';

const MONTH_DATA = [
  { month: 'Jan', applications: 150, hired: 35, x: 20, y: 175 },
  { month: 'Feb', applications: 180, hired: 45, x: 95, y: 170 },
  { month: 'Mar', applications: 450, hired: 90, x: 170, y: 130 },
  { month: 'Apr', applications: 380, hired: 80, x: 245, y: 142 },
  { month: 'May', applications: 640, hired: 140, x: 320, y: 95 },
  { month: 'Jun', applications: 920, hired: 210, x: 395, y: 45 },
  { month: 'Jul', applications: 760, hired: 180, x: 470, y: 70 },
];

export const AdminChart = () => {
  const [activePoint, setActivePoint] = useState(null);

  // Smooth SVG path coordinates
  // ViewBox: 0 0 500 220
  // Left margin 30, right margin 490, top 20, bottom 190
  const splinePath = `M 20 175 C 60 175, 70 170, 95 170 C 130 170, 140 130, 170 130 C 205 130, 220 145, 245 142 C 280 138, 290 98, 320 95 C 355 92, 370 45, 395 45 C 430 45, 445 70, 470 70`;
  const areaPath = `${splinePath} L 470 195 L 20 195 Z`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 text-left">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Dashboard Statistics
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Applications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>Hired</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Chart */}
      <div className="relative w-full overflow-hidden">
        {/* Hover Tooltip */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
            style={{
              left: `${(activePoint.x / 500) * 100}%`,
              top: `${(activePoint.y / 220) * 100}%`,
            }}
          >
            <div className="font-bold text-blue-300">{activePoint.month}</div>
            <div>Applications: {activePoint.applications.toLocaleString()}</div>
            <div className="text-emerald-300">Hired: {activePoint.hired.toLocaleString()}</div>
          </div>
        )}

        <div className="flex items-stretch">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-3 pb-7 select-none text-right w-10 shrink-0">
            <span>1000</span>
            <span>800</span>
            <span>500</span>
            <span>200</span>
            <span>0</span>
          </div>

          {/* SVG Graph Canvas */}
          <div className="flex-1 relative">
            <svg
              viewBox="0 0 500 220"
              className="w-full h-48 sm:h-56 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Area Gradient */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.01" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="20" y1="20" x2="470" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="65" x2="470" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="110" x2="470" y2="110" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="155" x2="470" y2="155" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="195" x2="470" y2="195" stroke="#E2E8F0" strokeWidth="1.2" />

              {/* Gradient Filled Area */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Spline Stroke Line */}
              <path
                d={splinePath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineGlow)"
              />

              {/* Interactive Data Point Dots */}
              {MONTH_DATA.map((pt, idx) => {
                const isHovered = activePoint?.month === pt.month;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setActivePoint(pt)}
                    onMouseLeave={() => setActivePoint(null)}
                    className="cursor-pointer"
                  >
                    {/* Invisible larger hover hit area */}
                    <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                    {/* Outer pulse when hovered */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        fill="#3B82F6"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Visible Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '6' : '4.5'}
                      fill="#2563EB"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between px-2 pt-2 text-[11px] font-medium text-slate-400 select-none">
              {MONTH_DATA.map((pt) => (
                <span
                  key={pt.month}
                  className={`transition-colors ${
                    activePoint?.month === pt.month ? 'font-bold text-blue-600' : ''
                  }`}
                >
                  {pt.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
