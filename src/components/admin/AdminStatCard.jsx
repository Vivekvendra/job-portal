import React from 'react';

export const AdminStatCard = ({
  icon: Icon,
  iconBg = 'bg-blue-500',
  title,
  value,
  cardBg = 'bg-white',
  borderColor = 'border-slate-100',
}) => {
  return (
    <div
      className={`${cardBg} ${borderColor} border rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex items-center gap-3.5 text-left`}
    >
      {/* Squircle Icon Badge with reduced size */}
      <div
        className={`w-9 h-9 rounded-lg ${iconBg} text-white flex items-center justify-center shrink-0 shadow-xs`}
      >
        <Icon className="w-4 h-4 stroke-[2.2]" />
      </div>

      {/* Text Info */}
      <div className="min-w-0">
        <span className="text-xs font-semibold text-slate-500 block truncate">
          {title}
        </span>
        <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
          {value}
        </span>
      </div>
    </div>
  );
};
