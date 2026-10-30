import React, { useState } from 'react';
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
import { ReportsManagement } from './ReportsManagement';
import { RecruiterApplicants } from './RecruiterApplicants';

export const Dashboard = () => {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

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
          
          {/* Header area for non-overview tabs */}
          {activeTab !== 'overview' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/80">
                    {user?.role === 'Recruiter' ? 'Recruiter Center' : 'Job Seeker Portal'}
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {user?.name}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 self-start sm:self-center">
                {user?.role === 'Recruiter' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('recruiter-applicants')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        activeTab === 'recruiter-applicants'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Inbound Pipeline
                    </button>
                    <button
                      onClick={() => setIsPostJobOpen(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                    >
                      + Post Vacancy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('search')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        activeTab === 'search'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Search Jobs
                    </button>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        activeTab === 'applications'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      My Applications
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminOverview onNavigate={setActiveTab} />
          )}

          {/* TAB: RECRUITER INBOUND APPLICANTS */}
          {activeTab === 'recruiter-applicants' && (
            <div className="space-y-6">
              <RecruiterApplicants />
            </div>
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

          {/* TAB: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <ReportsManagement />
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
