import React from 'react';
import {
  MapPin,
  Send,
  Bookmark,
  CheckCircle2,
  Edit,
  Trash2,
  Code2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useDashboard } from '../../context/DashboardContext';

export const JobDetailModal = ({
  isOpen,
  onClose,
  job,
  onEdit,
  onDelete,
}) => {
  const { savedJobs, applications, toggleSaveJob, applyToJob, toggleJobStatus } =
    useDashboard();

  if (!job) return null;

  const isSaved = savedJobs.includes(job.id);
  const isApplied = applications.some((app) => app.jobId === job.id);
  const isOpenStatus = job.status === 'Open';

  const skillsList = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === 'string'
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Job Details" maxWidth="max-w-3xl">
      <div className="space-y-6 text-left">
        {/* Header Profile Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={job.logo}
              alt={job.company}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 bg-white"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {job.title}
                </h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    isOpenStatus
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="font-semibold text-slate-700">{job.company}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>&bull;</span>
                <span className="font-semibold text-emerald-600">{job.salary}</span>
              </div>
            </div>
          </div>

          {/* Recruiter Management Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => toggleJobStatus(job.id)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Mark {isOpenStatus ? 'Closed' : 'Open'}
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(job);
              }}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 transition cursor-pointer"
              title="Edit Job"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(job);
              }}
              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
              title="Delete Job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Category</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{job.category}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Job Type</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{job.type}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Experience</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{job.experience}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-left">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Deadline</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{job.deadline}</div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Job Description & Responsibilities
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Required Skills Badges */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Required Skills & Tech Stack</span>
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            {skillsList.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Candidate Actions Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              isSaved
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved in Bookmarks' : 'Save Job'}</span>
          </button>

          <button
            onClick={() => applyToJob(job)}
            disabled={isApplied || !isOpenStatus}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer ${
              isApplied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : !isOpenStatus
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </>
            ) : !isOpenStatus ? (
              <span>Position Closed</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Apply for Position</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
