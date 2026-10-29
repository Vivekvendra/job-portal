import React from 'react';
import { User, Briefcase, FileCheck, Building2 } from 'lucide-react';

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: 'New candidate registered',
    subtitle: 'Rahul Sharma joined the platform',
    time: '10 minutes ago',
    icon: User,
    iconBg: 'bg-slate-900 text-white',
  },
  {
    id: 2,
    title: 'New job posting created',
    subtitle: 'Software Engineer at TechCorp',
    time: '35 minutes ago',
    icon: Briefcase,
    iconBg: 'bg-sky-600 text-white',
  },
  {
    id: 3,
    title: 'Application submitted',
    subtitle: 'Priya Patel applied for Frontend Lead',
    time: '1 hour ago',
    icon: FileCheck,
    iconBg: 'bg-rose-500 text-white',
  },
  {
    id: 4,
    title: 'Company verified',
    subtitle: 'Global Systems verified corporate profile',
    time: '2 hours ago',
    icon: Building2,
    iconBg: 'bg-emerald-500 text-white',
  },
];

export const AdminRecentActivities = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 text-left">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-5">
        Recent Activities
      </h3>

      <div className="space-y-4">
        {RECENT_ACTIVITIES.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              {/* Left: Icon & Description */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full ${act.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {act.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {act.subtitle}
                  </div>
                </div>
              </div>

              {/* Right: Timestamp */}
              <span className="text-xs font-medium text-slate-400 shrink-0 whitespace-nowrap">
                {act.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
