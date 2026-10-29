import React, { useState } from 'react';
import {
  Briefcase,
  UserCheck,
  Building2,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const AdminQuickActions = ({ onNavigate }) => {
  const [activeModal, setActiveModal] = useState(null);

  const ACTIONS = [
    {
      id: 'post_job',
      title: 'Post a Job',
      subtitle: 'Create a new vacancy',
      icon: Briefcase,
      iconBg: 'bg-blue-600',
      action: () => {
        if (onNavigate) {
          onNavigate('jobs');
        } else {
          setActiveModal('Post a Job');
          toast.info('Opening Job Creation Form');
        }
      },
    },
    {
      id: 'find_candidates',
      title: 'Find Candidates',
      subtitle: 'Search and hire talent',
      icon: UserCheck,
      iconBg: 'bg-amber-500',
      action: () => {
        if (onNavigate) {
          onNavigate('search');
        } else {
          setActiveModal('Find Candidates');
          toast.info('Searching Talent Pool');
        }
      },
    },
    {
      id: 'add_company',
      title: 'Add Company',
      subtitle: 'Register a company',
      icon: Building2,
      iconBg: 'bg-pink-500',
      action: () => {
        if (onNavigate) {
          onNavigate('companies');
        } else {
          setActiveModal('Add Company');
          toast.info('Opening Company Registration');
        }
      },
    },
    {
      id: 'view_applications',
      title: 'View Applications',
      subtitle: 'Manage applications',
      icon: FileText,
      iconBg: 'bg-indigo-600',
      action: () => {
        if (onNavigate) {
          onNavigate('applications');
        } else {
          setActiveModal('View Applications');
          toast.info('Opening Applications Review');
        }
      },
    },
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 text-left h-full flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-5">
            Quick Actions
          </h3>

          <div className="space-y-3.5">
            {ACTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-100/90 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg ${item.iconBg} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtle quick tips footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Quick actions update in real-time</span>
        </div>
      </div>

      {/* Quick Action Modal if clicked outside full portal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-left shadow-2xl border border-slate-100 space-y-4">
            <h4 className="text-base font-bold text-slate-900">{activeModal}</h4>
            <p className="text-xs text-slate-500">
              Quick action selected. You can create jobs, search candidates, manage companies, and view applications.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
