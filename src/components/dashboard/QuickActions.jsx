import React from 'react';
import {
  PlusCircle,
  Search,
  Bookmark,
  FileCheck,
  Building2,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const QuickActions = ({ onOpenPostJob, onSelectTab }) => {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'Recruiter';

  const candidateActions = [
    {
      title: 'Find New Jobs',
      description: 'Search & filter verified positions by salary, location & type',
      icon: Search,
      color: 'bg-blue-500',
      action: () => onSelectTab('search'),
      btnText: 'Search Jobs',
    },
    {
      title: 'Saved Bookmarks',
      description: 'Review and apply to jobs you saved earlier',
      icon: Bookmark,
      color: 'bg-indigo-500',
      action: () => onSelectTab('saved'),
      btnText: 'View Saved',
    },
    {
      title: 'Track Applications',
      description: 'Check status of pending interviews & submissions',
      icon: FileCheck,
      color: 'bg-emerald-500',
      action: () => onSelectTab('applications'),
      btnText: 'View Status',
    },
    {
      title: 'Top Companies',
      description: 'Discover verified employers actively hiring',
      icon: Building2,
      color: 'bg-amber-500',
      action: () => onSelectTab('companies'),
      btnText: 'Explore',
    },
  ];

  const recruiterActions = [
    {
      title: 'Post a New Job',
      description: 'Create listing to start receiving candidate applications',
      icon: PlusCircle,
      color: 'bg-purple-600',
      action: onOpenPostJob,
      btnText: 'Post Position',
    },
    {
      title: 'Review Applications',
      description: 'Screen resumes and manage hiring pipeline',
      icon: FileCheck,
      color: 'bg-blue-500',
      action: () => onSelectTab('applications'),
      btnText: 'Review Now',
    },
    {
      title: 'Talent Pool Search',
      description: 'Browse candidate profiles and invite top talent',
      icon: Users,
      color: 'bg-emerald-500',
      action: () => onSelectTab('jobs'),
      btnText: 'Search Talent',
    },
    {
      title: 'Company Profile',
      description: 'Manage branding, locations, and open vacancies',
      icon: Building2,
      color: 'bg-amber-500',
      action: () => onSelectTab('companies'),
      btnText: 'Manage Profile',
    },
  ];

  const actions = isRecruiter ? recruiterActions : candidateActions;

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
          <p className="text-xs text-slate-500">
            Common workflows tailored for {isRecruiter ? 'Recruiters' : 'Candidates'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:underline">
                <span>{item.btnText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
