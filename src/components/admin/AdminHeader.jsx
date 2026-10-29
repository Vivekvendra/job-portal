import React from 'react';
import { Briefcase, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader = () => {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-6 pb-4">
      {/* Top Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-xs">
          <Briefcase className="w-4 h-4 stroke-[2.4]" />
        </div>
        <div className="text-xl font-black text-white tracking-tight">
          JobPortal
        </div>
      </div>

      {/* Top Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notification Bell 1 */}
        <button
          type="button"
          className="p-1.5 text-slate-700 hover:text-blue-600 transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>

        {/* Notification Bell 2 with Red Badge '1' */}
        <button
          type="button"
          className="p-1.5 text-slate-700 hover:text-blue-600 transition-colors relative cursor-pointer"
          title="Unread Alerts"
        >
          <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            1
          </span>
        </button>

        {/* User Profile Avatar & Role */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/70">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
            alt="Vivek"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
          />
          <div className="text-left hidden sm:block leading-tight">
            <div className="text-sm font-bold text-slate-900">Vivek</div>
            <div className="text-xs text-slate-500 font-medium">Admin</div>
          </div>
        </div>

        {/* Optional Link to Modules Portal */}
        <Link
          to="/dashboard"
          className="hidden md:inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-blue-700 border border-blue-200 shadow-xs transition"
          title="Go to Full Job Portal"
        >
          Portal Modules &rarr;
        </Link>
      </div>
    </header>
  );
};
