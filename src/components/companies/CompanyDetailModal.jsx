import React from 'react';
import {
  MapPin,
  Globe,
  Mail,
  Users,
  ExternalLink,
  Briefcase,
  Edit,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useDashboard } from '../../context/DashboardContext';

export const CompanyDetailModal = ({
  isOpen,
  onClose,
  company,
  onEdit,
  onDelete,
}) => {
  const { jobs } = useDashboard();
  if (!company) return null;

  // Find all jobs posted by this company
  const companyJobs = jobs.filter(
    (j) => j.company.toLowerCase() === company.name.toLowerCase()
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Company Profile" maxWidth="max-w-3xl">
      <div className="space-y-6 text-left">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-100/70">
          <div className="flex items-center gap-4">
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 bg-white"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {company.name}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {company.industry}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {company.employees} Employees
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                onClose();
                onEdit(company);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(company);
              }}
              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Delete Company"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Company Overview / Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            About Company
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            {company.description}
          </p>
        </div>

        {/* Contact & Web Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Website</div>
                <div className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                  {company.website}
                </div>
              </div>
            </div>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Contact Email</div>
                <div className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                  {company.email}
                </div>
              </div>
            </div>
            <a
              href={`mailto:${company.email}`}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Active Openings for this company */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Active Job Postings ({companyJobs.length})</span>
            </h4>
          </div>

          {companyJobs.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
              No active job openings currently listed for this company.
            </div>
          ) : (
            <div className="space-y-2.5">
              {companyJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 transition flex items-center justify-between gap-3 bg-white"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">{job.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{job.location}</span>
                      <span>&bull;</span>
                      <span className="font-semibold text-emerald-600">{job.salary}</span>
                      <span>&bull;</span>
                      <span className="text-slate-400">{job.type}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      job.status === 'Open'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
