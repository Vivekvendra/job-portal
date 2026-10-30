import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Bookmark,
  Search,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  XCircle,
  Trash2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { EmptyState } from '../components/common/EmptyState';

export const ApplicationsManagement = ({ defaultTab = 'applications', onNavigate }) => {
  const {
    applications,
    jobs,
    savedJobs,
    withdrawApplication,
    removeSavedJob,
    applyToJob,
  } = useDashboard();

  const [activeSubTab, setActiveSubTab] = useState(defaultTab); // 'applications' | 'saved'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [withdrawingApp, setWithdrawingApp] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        app.title.toLowerCase().includes(term) ||
        app.company.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'ALL' || app.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Saved Jobs List derived from jobs database
  const savedJobsList = useMemo(() => {
    return jobs.filter((j) => {
      const isBookmarked = savedJobs.includes(j.id);
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term);
      return isBookmarked && matchesSearch;
    });
  }, [jobs, savedJobs, searchTerm]);

  // Status Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Interview Scheduled':
      case 'Interview':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Offer Extended':
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Withdrawn':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const handleConfirmWithdraw = () => {
    if (withdrawingApp) {
      withdrawApplication(withdrawingApp.id);
      setWithdrawingApp(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Applications & Saved Jobs
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track your recruitment pipeline, review submission status, and manage bookmarked positions
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-blue-50/80 rounded-2xl border border-blue-100 text-left">
              <span className="text-[11px] font-bold text-blue-600 uppercase block">Total Applied</span>
              <span className="text-xl font-black text-blue-900">{applications.length}</span>
            </div>
            <div className="px-4 py-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 text-left">
              <span className="text-[11px] font-bold text-indigo-600 uppercase block">Saved Jobs</span>
              <span className="text-xl font-black text-indigo-900">{savedJobs.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Applied Jobs vs Saved Jobs */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveSubTab('applications');
              setSearchTerm('');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Applied Jobs ({applications.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('saved');
              setSearchTerm('');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === 'saved'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Jobs ({savedJobs.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: APPLIED JOBS */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {/* Search Applications & Status Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search applied positions by title or company..."
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
              {['ALL', 'Submitted', 'In Review', 'Interview Scheduled', 'Withdrawn'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title="No applications match your criteria"
              description="Explore career search to discover new opportunities and submit applications in 1 click."
              actionText="Browse Open Jobs"
              onAction={() => onNavigate && onNavigate('search')}
            />
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app) => {
                const isWithdrawn = app.status === 'Withdrawn';
                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Position Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 font-bold">
                        <FileCheck className="w-6 h-6 stroke-[2]" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {app.title}
                          </h3>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {app.company}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Applied on {app.appliedDate}
                          </span>
                          {app.location && (
                            <>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {app.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      {isWithdrawn ? (
                        <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>Withdrawn</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setWithdrawingApp(app)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SAVED JOBS */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          {/* Search Saved Jobs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved bookmarks..."
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold hidden sm:block">
              {savedJobsList.length} bookmarked
            </div>
          </div>

          {/* Saved Jobs List */}
          {savedJobsList.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved bookmarks found"
              description="Click the bookmark icon on any job card during your career search to save it here for later review."
              actionText="Search Opportunities"
              onAction={() => onNavigate && onNavigate('search')}
            />
          ) : (
            <div className="space-y-3">
              {savedJobsList.map((job) => {
                const isApplied = applications.some((app) => app.jobId === job.id);
                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Left: Job Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0 bg-white"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            onClick={() => setSelectedJobDetail(job)}
                            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate"
                          >
                            {job.title}
                          </h3>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {job.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {job.company}
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                          <span>&bull;</span>
                          <span className="font-bold text-emerald-600">{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => setSelectedJobDetail(job)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Details
                      </button>

                      {/* Remove Bookmark */}
                      <button
                        type="button"
                        onClick={() => removeSavedJob(job.id)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Apply Now */}
                      <button
                        type="button"
                        onClick={() => applyToJob(job)}
                        disabled={isApplied}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                          isApplied
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Apply Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Withdraw Application */}
      {withdrawingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-left shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Withdraw Application</h4>
                <p className="text-xs text-slate-500">Confirm withdrawing your submission</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to withdraw your application for{' '}
              <span className="font-bold text-slate-900">{withdrawingApp.title}</span> at{' '}
              <span className="font-bold text-slate-900">{withdrawingApp.company}</span>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setWithdrawingApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Keep Application
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailModal
        isOpen={Boolean(selectedJobDetail)}
        onClose={() => setSelectedJobDetail(null)}
        job={selectedJobDetail}
      />
    </div>
  );
};
