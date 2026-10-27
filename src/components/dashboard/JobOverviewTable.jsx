import React from 'react';
import {
  MapPin,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Send,
  Building,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const JobOverviewTable = ({ searchTerm = '', filterSavedOnly = false }) => {
  const { jobs, savedJobs, applications, toggleSaveJob, applyToJob } = useDashboard();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterSavedOnly) {
      return matchesSearch && savedJobs.includes(job.id);
    }
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {filterSavedOnly ? 'Saved Jobs Bookmarks' : 'Active Job Postings'}
          </h3>
          <p className="text-xs text-slate-500">
            {filterSavedOnly
              ? 'Positions you have bookmarked for later review'
              : 'Featured opportunities verified and currently accepting candidates'}
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-blue-600 font-bold">{filteredJobs.length}</span> positions
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No jobs match your criteria</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or clear filters.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredJobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);
            const isApplied = applications.some((app) => app.jobId === job.id);

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Company Logo & Details */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {job.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
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
                      <span className="font-medium text-emerald-600">{job.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Bookmark Save Button */}
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save job'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Apply Button */}
                  <button
                    onClick={() => applyToJob(job)}
                    disabled={isApplied}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
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
                        <span>Quick Apply</span>
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
  );
};
