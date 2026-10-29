import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  LayoutDashboard,
  Building2,
  Bookmark,
  FileCheck,
  LogOut,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

export const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { user, logout, switchRole } = useAuth();
  const { savedJobs, applications } = useDashboard();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'search',
      label: 'Job Search',
      icon: Search,
      badge: 'Hot',
    },
    {
      id: 'jobs',
      label: 'Job Postings',
      icon: Briefcase,
      badge: '8.5K',
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: Building2,
      badge: '1.2K',
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileCheck,
      badge: applications.length > 0 ? applications.length : null,
    },
    {
      id: 'saved',
      label: 'Saved Jobs',
      icon: Bookmark,
      badge: savedJobs.length > 0 ? savedJobs.length : null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Briefcase className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-xl tracking-tight text-slate-900">
                <span className="font-extrabold">Job</span>
                <span className="font-semibold text-slate-700">Portal</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Role Card & Switcher */}
          <div className="p-4 mx-3 mt-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-100/70">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Current Mode
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  user?.role === 'Recruiter'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {user?.role || 'Candidate'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 mt-2">
              <span>Switch View:</span>
              <button
                type="button"
                onClick={() =>
                  switchRole(user?.role === 'Recruiter' ? 'Candidate' : 'Recruiter')
                }
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Switch to {user?.role === 'Recruiter' ? 'Candidate' : 'Recruiter'}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: User Details & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
                }
                alt={user?.name || 'User avatar'}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 text-left">
                <div className="text-sm font-bold text-slate-800 truncate">
                  {user?.name || 'Sarah Jenkins'}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {user?.email || 'user@jobportal.com'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
