import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  FileCheck,
  Bookmark,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Topbar } from '../components/dashboard/Topbar';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { JobOverviewTable } from '../components/dashboard/JobOverviewTable';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { CompanyManagement } from './CompanyManagement';
import { JobManagement } from './JobManagement';
import { StatSkeleton } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';

export const Dashboard = () => {
  const { user } = useAuth();
  const { stats, isDataLoading, savedJobs, applications } = useDashboard();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const greeting = 'Welcome back';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modules 1, 2, 3 & 4 Active &bull; {user?.role || 'Candidate'} Portal</span>
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
                  onClick={() => setIsPostJobOpen(true)}
                  className="px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
                >
                  + Post a New Job
                </button>
                <button
                  onClick={() => setActiveTab('companies')}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition cursor-pointer"
                >
                  Partner Companies
                </button>
              </div>
            </div>

            {/* Subtle background abstract shapes */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute right-48 -top-12 w-48 h-48 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Module 2: Dashboard Statistics Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Platform Statistics
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time metrics calculated across companies, jobs, candidates, and applications
                    </p>
                  </div>
                </div>

                {isDataLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <StatSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 1. Total Companies */}
                    <StatCard
                      title="Total Companies"
                      value={stats.totalCompanies}
                      change={stats.metrics.companiesGrowth}
                      icon={Building2}
                      colorScheme="blue"
                    />

                    {/* 2. Total Jobs */}
                    <StatCard
                      title="Total Jobs"
                      value={stats.totalJobs}
                      change={stats.metrics.jobsGrowth}
                      icon={Briefcase}
                      colorScheme="emerald"
                    />

                    {/* 3. Active Job Postings */}
                    <StatCard
                      title="Active Job Postings"
                      value={stats.activeJobPostings}
                      change={stats.metrics.activeRate}
                      icon={CheckCircle}
                      colorScheme="purple"
                    />

                    {/* 4. Total Candidates */}
                    <StatCard
                      title="Total Candidates"
                      value={stats.totalCandidates}
                      change={stats.metrics.candidatesGrowth}
                      icon={Users}
                      colorScheme="indigo"
                    />

                    {/* 5. Total Applications */}
                    <StatCard
                      title="Total Applications"
                      value={stats.totalApplications}
                      change={stats.metrics.applicationsGrowth}
                      icon={FileCheck}
                      colorScheme="amber"
                    />

                    {/* 6. Saved Jobs */}
                    <StatCard
                      title="Saved Jobs"
                      value={savedJobs.length || stats.savedJobsCount}
                      change={stats.metrics.savedJobsGrowth}
                      icon={Bookmark}
                      colorScheme="rose"
                    />
                  </div>
                )}
              </div>

              {/* Quick Action Cards */}
              <QuickActions
                onOpenPostJob={() => setIsPostJobOpen(true)}
                onSelectTab={setActiveTab}
              />

              {/* Two Column Layout: Recent Activities & Featured Jobs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Active Jobs Preview (7 cols) */}
                <div className="lg:col-span-7">
                  <JobOverviewTable searchTerm={searchTerm} />
                </div>

                {/* Recent Activities (5 cols) */}
                <div className="lg:col-span-5">
                  <RecentActivity />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MODULE 4 - JOB POSTING & MANAGEMENT */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <JobManagement />
            </div>
          )}

          {/* TAB 3: MODULE 3 - COMPANY MANAGEMENT */}
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
