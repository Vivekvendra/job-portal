import React from 'react';
import {
  MapPin,
  Briefcase,
  Bookmark,
  Calendar,
  Send,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const JobSearchCard = ({ job, onSelectJob, onSkillClick }) => {
  const { savedJobs, applications, toggleSaveJob, applyToJob } = useDashboard();

  const isSaved = savedJobs.includes(job.id);
  const isApplied = applications.some((app) => app.jobId === job.id);
  const isOpen = job.status === 'Open';

  const skillsList = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === 'string'
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between text-left group">
      <div>
        {/* Top Header: Logo, Company, Title, Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3.5 min-w-0">
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0 bg-white"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700 hover:text-blue-600 transition truncate">
                  {job.company}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {job.category}
                </span>
                {job.postedDate === 'Just now' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    New
                  </span>
                )}
              </div>
              <h3
                onClick={() => onSelectJob(job)}
                className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer mt-0.5 leading-snug line-clamp-1"
                title={job.title}
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isSaved
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600 shadow-xs'
                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Remove from Saved Jobs' : 'Save this Job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Badges Bar: Location, Job Type, Experience */}
        <div className="flex items-center gap-2 flex-wrap mb-3.5 text-xs">
          <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[140px]">{job.location}</span>
          </span>

          <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.type}</span>
          </span>

          <span className="font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            {job.experience}
          </span>
        </div>

        {/* Salary & Deadline strip */}
        <div className="flex items-center justify-between gap-2 p-2.5 mb-3.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Compensation
            </span>
            <span className="font-extrabold text-emerald-600 text-xs sm:text-sm">
              {job.salary}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3" />
              Deadline
            </span>
            <span className="font-semibold text-slate-700 text-xs">
              {job.deadline}
            </span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Required Skills Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {skillsList.slice(0, 4).map((skill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSkillClick && onSkillClick(skill)}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition cursor-pointer"
            >
              #{skill}
            </button>
          ))}
          {skillsList.length > 4 && (
            <span className="text-[11px] font-semibold text-slate-400">
              +{skillsList.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: View Details & Quick Apply */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectJob(job)}
          className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer py-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => applyToJob(job)}
          disabled={isApplied || !isOpen}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
            isApplied
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : !isOpen
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Applied</span>
            </>
          ) : !isOpen ? (
            <span>Closed</span>
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
};
