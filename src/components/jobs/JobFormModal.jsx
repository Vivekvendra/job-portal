import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Code2,
  Save,
  PlusCircle,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useDashboard } from '../../context/DashboardContext';

export const JobFormModal = ({ isOpen, onClose, jobToEdit = null }) => {
  const { addJob, updateJob, companies } = useDashboard();
  const isEditing = Boolean(jobToEdit);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      company: '',
      category: 'Engineering',
      type: 'Full-time',
      experience: 'Mid-Level (3+ yrs)',
      salary: '$110,000 - $140,000',
      location: 'Remote',
      skills: 'React, TypeScript, Tailwind CSS',
      deadline: '2026-12-31',
      status: 'Open',
      description: '',
      logo: '',
    },
  });

  const selectedStatus = watch('status');

  // Pre-fill on editing
  useEffect(() => {
    if (jobToEdit) {
      reset({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        category: jobToEdit.category || 'Engineering',
        type: jobToEdit.type || 'Full-time',
        experience: jobToEdit.experience || 'Mid-Level (3+ yrs)',
        salary: jobToEdit.salary || '$110,000 - $140,000',
        location: jobToEdit.location || 'Remote',
        skills: Array.isArray(jobToEdit.skills)
          ? jobToEdit.skills.join(', ')
          : jobToEdit.skills || '',
        deadline: jobToEdit.deadline || '2026-12-31',
        status: jobToEdit.status || 'Open',
        description: jobToEdit.description || '',
        logo: jobToEdit.logo || '',
      });
    } else {
      reset({
        title: '',
        company: companies[0]?.name || 'TechNova Global',
        category: 'Engineering',
        type: 'Full-time',
        experience: 'Mid-Level (3+ yrs)',
        salary: '$110,000 - $140,000',
        location: 'Remote',
        skills: 'React, TypeScript, Tailwind CSS',
        deadline: '2026-12-31',
        status: 'Open',
        description: '',
        logo: '',
      });
    }
  }, [jobToEdit, reset, isOpen, companies]);

  const onSubmit = async (data) => {
    const matchedCompany = companies.find(
      (c) => c.name.toLowerCase() === data.company.toLowerCase()
    );

    const submissionData = {
      ...data,
      logo:
        data.logo ||
        matchedCompany?.logo ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
    };

    if (isEditing) {
      updateJob(jobToEdit.id, submissionData);
    } else {
      addJob(submissionData);
    }
    reset();
    onClose();
  };

  const categories = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'Finance',
    'Data & AI',
    'Healthcare',
  ];

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Remote',
    'Hybrid',
    'Internship',
  ];

  const experienceLevels = [
    'Entry-Level (0-2 yrs)',
    'Mid-Level (3+ yrs)',
    'Senior (5+ yrs)',
    'Lead / Principal',
    'Director / Executive',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
        {/* Row 1: Job Title & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Title *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
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

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Building className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                list="company-options"
                type="text"
                placeholder="Select or enter company"
                {...register('company', { required: 'Company is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
              <datalist id="company-options">
                {companies.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            {errors.company && (
              <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Category, Type & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Category *
            </label>
            <select
              {...register('category')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Employment Type *
            </label>
            <select
              {...register('type')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Experience Level *
            </label>
            <select
              {...register('experience')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              {experienceLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Salary Range & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Salary Range *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <DollarSign className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. $120,000 - $150,000"
                {...register('salary', { required: 'Salary range is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.salary && (
              <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Remote, San Francisco, CA"
                {...register('location', { required: 'Location is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Row 4: Required Skills & Application Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Required Skills (comma separated) *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Code2 className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. React, TypeScript, Node.js, GraphQL"
                {...register('skills', { required: 'Required skills are required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.skills && (
              <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Application Deadline *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Calendar className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="date"
                {...register('deadline', { required: 'Application deadline is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{errors.deadline.message}</p>
            )}
          </div>
        </div>

        {/* Row 5: Job Status (Open / Closed) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Status *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValue('status', 'Open')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                selectedStatus === 'Open'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-100'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Open (Accepting Applications)</span>
            </button>
            <button
              type="button"
              onClick={() => setValue('status', 'Closed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                selectedStatus === 'Closed'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-100'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Closed (Applications Paused)</span>
            </button>
          </div>
        </div>

        {/* Row 6: Job Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Job Description & Responsibilities *
          </label>
          <div className="rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white p-2">
            <textarea
              rows={4}
              placeholder="Outline the responsibilities, qualifications, project scope, and benefits for this opening..."
              {...register('description', {
                required: 'Job description is required',
                minLength: {
                  value: 30,
                  message: 'Description must be at least 30 characters',
                },
              })}
              className="w-full p-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent resize-none"
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Job Changes</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Job Opening</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
