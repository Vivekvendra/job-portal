import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { CompanyManagement } from './CompanyManagement';
import { JobManagement } from './JobManagement';
import { JobSearch } from './JobSearch';
import { AdminOverview } from '../components/admin/AdminOverview';
import { CandidateProfile } from './CandidateProfile';
import { ApplicationsManagement } from './ApplicationsManagement';

export const Dashboard = () => {
  const { user } = useAuth();

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

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <ApplicationsManagement defaultTab="applications" onNavigate={setActiveTab} />
            </div>
          )}

          {/* TAB: SAVED JOBS */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <ApplicationsManagement defaultTab="saved" onNavigate={setActiveTab} />
            </div>
          )}

          {/* TAB: CANDIDATE PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <CandidateProfile />
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
