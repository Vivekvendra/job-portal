import React from 'react';
import { AdminWelcome } from './AdminWelcome';
import { AdminStatsGrid } from './AdminStatsGrid';
import { AdminChart } from './AdminChart';
import { AdminRecentActivities } from './AdminRecentActivities';
import { AdminQuickActions } from './AdminQuickActions';

export const AdminOverview = ({ onNavigate }) => {
  return (
    <div className="space-y-6 sm:space-y-7 text-left">
      {/* Welcome Section */}
      <AdminWelcome />

      {/* 6 Statistic Cards Grid */}
      <AdminStatsGrid />

      {/* Bottom Section: Left (Chart + Activities) & Right (Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
        {/* Left Column (8 cols): Dashboard Statistics Chart & Recent Activities */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-7 flex flex-col justify-between">
          {/* Applications Trend Chart */}
          <AdminChart />

          {/* Recent Activities List */}
          <AdminRecentActivities />
        </div>

        {/* Right Column (4 cols): Quick Actions Cards */}
        <div className="lg:col-span-4">
          <AdminQuickActions onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
