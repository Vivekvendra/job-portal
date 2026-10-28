import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Users,
  Image,
  Layers,
  Save,
  PlusCircle,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useDashboard } from '../../context/DashboardContext';

export const CompanyModal = ({ isOpen, onClose, companyToEdit = null }) => {
  const { addCompany, updateCompany } = useDashboard();
  const isEditing = Boolean(companyToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      logo: '',
      industry: 'Software & Cloud',
      location: '',
      website: '',
      email: '',
      employees: '50-200',
      description: '',
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (companyToEdit) {
      reset({
        name: companyToEdit.name || '',
        logo: companyToEdit.logo || '',
        industry: companyToEdit.industry || 'Software & Cloud',
        location: companyToEdit.location || '',
        website: companyToEdit.website || '',
        email: companyToEdit.email || '',
        employees: companyToEdit.employees || '50-200',
        description: companyToEdit.description || '',
      });
    } else {
      reset({
        name: '',
        logo: '',
        industry: 'Software & Cloud',
        location: '',
        website: '',
        email: '',
        employees: '50-200',
        description: '',
      });
    }
  }, [companyToEdit, reset, isOpen]);

  const onSubmit = async (data) => {
    const submissionData = {
      ...data,
      logo:
        data.logo ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name)}`,
    };

    if (isEditing) {
      updateCompany(companyToEdit.id, submissionData);
    } else {
      addCompany(submissionData);
    }
    reset();
    onClose();
  };

  const industries = [
    'Software & Cloud',
    'FinTech & AI',
    'Payment Processing',
    'Data Infrastructure',
    'Machine Learning',
    'Design & Media',
    'Healthcare & Biotech',
    'CleanTech & Energy',
    'E-Commerce & Retail',
    'Cybersecurity',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Company Information' : 'Add New Partner Company'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
        {/* Row 1: Company Name & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Building2 className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Acme Technologies"
                {...register('name', { required: 'Company name is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Industry *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Layers className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <select
                {...register('industry', { required: 'Industry is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 bg-transparent focus:outline-none rounded-xl"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Location & Number of Employees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. San Francisco, CA / Remote"
                {...register('location', { required: 'Location is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Number of Employees *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Users className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. 50-200, 1,500+"
                {...register('employees', { required: 'Employee count is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.employees && (
              <p className="text-red-500 text-xs mt-1">{errors.employees.message}</p>
            )}
          </div>
        </div>

        {/* Row 3: Website & Contact Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Website URL *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Globe className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="https://example.com"
                {...register('website', { required: 'Website URL is required' })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.website && (
              <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Email *
            </label>
            <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="careers@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address',
                  },
                })}
                className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Row 4: Company Logo URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Company Logo (Image URL)
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
            <Image className="absolute left-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="https://example.com/logo.png (optional, defaults to generated logo)"
              {...register('logo')}
              className="w-full py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
            />
          </div>
        </div>

        {/* Row 5: Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Company Description *
          </label>
          <div className="relative rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white p-2">
            <textarea
              rows={3}
              placeholder="Brief description of the company, mission, work culture, and products..."
              {...register('description', {
                required: 'Company description is required',
                minLength: {
                  value: 20,
                  message: 'Please provide at least 20 characters',
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
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
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
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Add Company</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
