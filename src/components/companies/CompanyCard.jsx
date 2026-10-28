import React from 'react';
import {
  MapPin,
  Globe,
  Mail,
  Users,
  ExternalLink,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';

export const CompanyCard = ({ company, onSelect, onEdit, onDelete }) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between text-left group">
      <div>
        {/* Top Header: Logo, Name & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={company.logo}
              alt={company.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0 bg-white"
            />
            <div className="min-w-0">
              <h4
                onClick={() => onSelect(company)}
                className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate cursor-pointer"
              >
                {company.name}
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 inline-block mt-0.5">
                {company.industry}
              </span>
            </div>
          </div>

          {/* Quick Edit/Delete Icons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(company)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
              title="Edit Company"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(company)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Delete Company"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {company.description}
        </p>

        {/* Metadata info */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Location:
            </span>
            <span className="font-semibold text-slate-800 truncate max-w-[150px]">
              {company.location}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Employees:
            </span>
            <span className="font-semibold text-slate-800">{company.employees}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Contact:
            </span>
            <a
              href={`mailto:${company.email}`}
              className="text-blue-600 hover:underline truncate max-w-[150px]"
            >
              {company.email}
            </a>
          </div>
        </div>
      </div>

      {/* Card Footer: View Details & Website */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          onClick={() => onSelect(company)}
          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
