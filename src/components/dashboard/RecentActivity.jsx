import React, { useState } from 'react';
import {
  FileCheck,
  Calendar,
  Briefcase,
  Eye,
  Bookmark,
  Clock,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const RecentActivity = () => {
  const { activities } = useDashboard();
  const [filter, setFilter] = useState('ALL');

  const getIcon = (type) => {
    switch (type) {
      case 'application_submitted':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'job_posted':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'profile_viewed':
        return <Eye className="w-4 h-4 text-amber-600" />;
      case 'job_saved':
        return <Bookmark className="w-4 h-4 text-indigo-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Interview':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Active':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Viewed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Saved':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Submitted':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filter === 'ALL') return true;
    if (filter === 'APPLICATIONS') return act.type === 'application_submitted';
    if (filter === 'INTERVIEWS') return act.type === 'interview_scheduled';
    if (filter === 'POSTINGS') return act.type === 'job_posted';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
          <p className="text-xs text-slate-500">
            Real-time feed of applications, views, and updates
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['ALL', 'APPLICATIONS', 'INTERVIEWS'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                filter === f
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {f.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-slate-100">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No activity records matching this filter.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(act.type)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    <span className="font-bold text-slate-900">{act.user}</span>{' '}
                    <span className="text-slate-500 font-normal">
                      {act.type === 'job_saved'
                        ? 'saved position'
                        : act.type === 'profile_viewed'
                        ? 'reviewed'
                        : act.type === 'job_posted'
                        ? 'posted'
                        : 'applied to'}{' '}
                    </span>
                    <span className="text-blue-600 font-medium">{act.target}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{act.role}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                    act.status
                  )}`}
                >
                  {act.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
