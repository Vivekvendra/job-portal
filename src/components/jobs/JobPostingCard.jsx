import React from 'react';
import {
  MapPin,
  Calendar,
  Bookmark,
  CheckCircle2,
  Send,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const JobPostingCard = ({ job, onSelect, onEdit, onDelete }) => {
  const { savedJobs, applications, toggleSaveJob, applyToJob, toggleJobStatus } =
    useDashboard();

  const isSaved = savedJobs.includes(job.id);
  const isApplied = applications.some((app) => app.jobId === job.id);
  const isOpen = job.status === 'Open';

  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === 'string'
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between text-left group">
      <div>
        {/* Top Row: Company Logo, Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0 bg-white"
            />
            <div className="min-w-0">
              <h4
                onClick={() => onSelect(job)}
                className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate cursor-pointer"
              >
                {job.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700 truncate">{job.company}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleJobStatus(job.id)}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                isOpen
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
              title="Click to toggle status"
            >
              {job.status}
            </button>
            <button
              onClick={() => onEdit(job)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              title="Edit Job"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(job)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Delete Job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges: Category, Type, Experience, Salary */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
            {job.category}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
            {job.type}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {job.experience}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 ml-auto">
            {job.salary}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {job.description}
        </p>

        {/* Skills Pills */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {skills.slice(0, 4).map((s, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
            >
              {s}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[10px] font-bold text-slate-400">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Deadline: {job.deadline}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => onSelect(job)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => applyToJob(job)}
            disabled={isApplied || !isOpen}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              isApplied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : !isOpen
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95'
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
                <span>Apply</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
