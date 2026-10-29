import React, { useState } from 'react';
import {
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
import { JobOverviewTable } from '../components/dashboard/JobOverviewTable';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { CompanyManagement } from './CompanyManagement';
import { JobManagement } from './JobManagement';
import { JobSearch } from './JobSearch';
import { AdminOverview } from '../components/admin/AdminOverview';
import { EmptyState } from '../components/common/EmptyState';

export const Dashboard = () => {
  const { user } = useAuth();
  const { applications } = useDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const greeting = 'Welcome back';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF2FE] via-[#F3F5FE] to-[#F9F7FF] flex flex-col font-sans select-none antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Layout Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          
          {/* Welcome Banner (shown on non-overview tabs) */}
          {activeTab !== 'overview' && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Verified Workspace &bull; {user?.role || 'Candidate'} Portal</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    {greeting}, {user?.name || 'Explorer'}! 👋
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base mt-1.5 max-w-xl">
                    {user?.role === 'Recruiter'
                      ? 'Manage your job listings, review inbound applications, and recruit world-class talent.'
                      : 'Discover curated job matches, manage your applications, and track opportunities in real-time.'}
                  </p>
                </div>

                {/* Action buttons inside banner */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('search')}
                    className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
                  >
                    Search Jobs
                  </button>
                  <button
                    onClick={() => setIsPostJobOpen(true)}
                    className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-xs transition cursor-pointer"
                  >
                    + Post Job
                  </button>
                </div>
              </div>

              {/* Subtle background abstract shapes */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute right-48 -top-12 w-48 h-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminOverview onNavigate={setActiveTab} />
          )}

          {/* TAB: JOB SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <JobSearch />
            </div>
          )}

          {/* TAB: JOB POSTINGS & MANAGEMENT */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <JobManagement />
            </div>
          )}

          {/* TAB: COMPANY MANAGEMENT */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <CompanyManagement />
            </div>
          )}

          {/* TAB 4: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6 text-left">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Your Applications</h3>
                    <p className="text-xs text-slate-500">
                      Track submissions, interviews, and progress across all applied positions
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                    {applications.length} Submitted
                  </span>
                </div>

                {applications.length === 0 ? (
                  <EmptyState
                    title="No applications submitted yet"
                    description="Browse available positions and submit your application with a single click."
                    actionText="Browse Open Jobs"
                    onAction={() => setActiveTab('jobs')}
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{app.title}</div>
                            <div className="text-xs text-slate-500">
                              {app.company} &bull; Applied on {app.appliedDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SAVED JOBS */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <JobOverviewTable searchTerm={searchTerm} filterSavedOnly={true} />
            </div>
          )}
        </main>
      </div>

      {/* Recruiter / Quick Post Job Modal */}
      <JobFormModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
      />
    </div>
  );
};
