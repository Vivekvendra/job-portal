import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, Building, MapPin, DollarSign, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';

export const PostJobModal = ({ isOpen, onClose }) => {
  const { postNewJob } = useDashboard();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      company: user?.company || 'TechCorp Global',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      experience: 'Mid-Level (3+ yrs)',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      postNewJob(data);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job Posting">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Title *
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
            <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Lead Full-Stack Engineer"
              {...register('title', { required: 'Job title is required' })}
              className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Company Name & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
              <Building className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Company Name"
                {...register('company', { required: 'Company name is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.company && (
              <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
              <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Remote / New York, NY"
                {...register('location', { required: 'Location is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Employment Type & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Employment Type
            </label>
            <select
              {...register('type')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              {...register('experience')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
              <option value="Mid-Level (3+ yrs)">Mid-Level (3+ yrs)</option>
              <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
              <option value="Lead / Executive">Lead / Executive</option>
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Salary Range
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
            <DollarSign className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. $120,000 - $150,000"
              {...register('salary')}
              className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Publish Job</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
