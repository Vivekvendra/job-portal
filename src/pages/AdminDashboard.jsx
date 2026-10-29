import React from 'react';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminWelcome } from '../components/admin/AdminWelcome';
import { AdminStatsGrid } from '../components/admin/AdminStatsGrid';
import { AdminChart } from '../components/admin/AdminChart';
import { AdminRecentActivities } from '../components/admin/AdminRecentActivities';
import { AdminQuickActions } from '../components/admin/AdminQuickActions';

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF2FE] via-[#F3F5FE] to-[#F9F7FF] font-sans antialiased text-slate-800 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Top Left Organic Blue Wave Graphic matching Reference Image */}
      <div className="absolute top-0 left-0 w-full max-w-[620px] h-[250px] sm:h-[280px] pointer-events-none select-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 620 280"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueWaveGradient" x1="0" y1="0" x2="540" y2="240" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1D4ED8" />
              <stop offset="0.45" stopColor="#2563EB" />
              <stop offset="0.85" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.75" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1D4ED8" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Smooth organic wave curve */}
          <path
            d="M 0 0 L 460 0 C 370 25, 310 75, 250 135 C 190 195, 140 235, 75 225 C 30 218, 0 175, 0 150 Z"
            fill="url(#blueWaveGradient)"
            filter="url(#softShadow)"
          />
        </svg>
      </div>

      {/* Top Navigation */}
      <AdminHeader />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 pb-16 space-y-6 sm:space-y-7">
        {/* Welcome Section */}
        <AdminWelcome />

        {/* 6 Statistic Cards Grid */}
        <AdminStatsGrid />

        {/* Bottom Section: Left (Chart + Activities) & Right (Quick Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
          {/* Left Column (8 cols): Dashboard Statistics Chart & Recent Activities */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-7 flex flex-col justify-between">
            {/* Trend Chart */}
            <AdminChart />

            {/* Recent Activities List */}
            <AdminRecentActivities />
          </div>

          {/* Right Column (4 cols): Quick Actions Cards */}
          <div className="lg:col-span-4">
            <AdminQuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};
