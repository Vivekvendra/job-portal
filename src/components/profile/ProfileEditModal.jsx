import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export const ProfileEditModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  // Experience and Education list states
  const [experiences, setExperiences] = useState(() => user?.experience || []);
  const [educations, setEducations] = useState(() => user?.education || []);
  const [resumeData, setResumeData] = useState(() => user?.resume || null);
  const [avatarPreview, setAvatarPreview] = useState(() => user?.avatar || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
      title: user?.title || '',
      bio: user?.bio || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
    },
  });

  if (!isOpen) return null;

  // Handle Resume UI Upload
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const simulated = {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setResumeData(simulated);
      toast.success(`Resume "${file.name}" uploaded successfully!`);
    }
  };

  // Add new experience entry
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: `exp_${Date.now()}`,
        title: '',
        company: '',
        duration: '',
        location: '',
        description: '',
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  // Add new education entry
  const handleAddEducation = () => {
    setEducations([
      ...educations,
      {
        id: `edu_${Date.now()}`,
        degree: '',
        institution: '',
        year: '',
        grade: '',
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const onSubmit = (data) => {
    // Parse skills
    const parsedSkills = data.skills
      ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const updatedProfile = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      title: data.title,
      bio: data.bio,
      skills: parsedSkills,
      experience: experiences.filter((e) => e.title && e.company),
      education: educations.filter((e) => e.degree && e.institution),
      resume: resumeData,
      avatar: avatarPreview || user?.avatar,
    };

    updateProfile(updatedProfile);
    toast.success('Candidate profile updated successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Edit Candidate Profile</h3>
              <p className="text-xs text-blue-100">Keep your professional credentials updated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6 text-left">
          {/* Avatar Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={avatarPreview || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30 shadow-xs shrink-0 bg-white"
            />
            <div className="flex-1 w-full text-left">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={avatarPreview}
                onChange={(e) => setAvatarPreview(e.target.value)}
                placeholder="https://images.unsplash.com/... or image URL"
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Paste any secure image URL or leave default.</p>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full Name is required' })}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                  errors.name ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                  errors.email ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                {...register('mobile', { required: 'Mobile number is required' })}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                  errors.mobile ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.mobile && <p className="text-rose-500 text-xs mt-1">{errors.mobile.message}</p>}
            </div>

            {/* Professional Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Job Title / Headline *</span>
              </label>
              <input
                type="text"
                placeholder="Senior Frontend Developer"
                {...register('title', { required: 'Headline is required' })}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                  errors.title ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Address / Location *</span>
            </label>
            <input
              type="text"
              placeholder="City, State, Zip Code"
              {...register('address', { required: 'Address is required' })}
              className={`w-full py-2.5 px-3.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
                errors.address ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          {/* Bio / Summary */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Professional Summary
            </label>
            <textarea
              rows={3}
              {...register('bio')}
              placeholder="Write a brief overview of your background, achievements, and career focus..."
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Skills (comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Tailwind CSS, Node.js, GraphQL"
              {...register('skills')}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Separate each skill with a comma to generate skill badges.
            </p>
          </div>

          {/* Work Experience Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Work Experience</span>
              </label>
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            {experiences.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No work experience listed yet.</p>
            ) : (
              <div className="space-y-3">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => handleUpdateExperience(idx, 'title', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2022 - Present)"
                        value={exp.duration}
                        onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Location (e.g. San Francisco, CA)"
                        value={exp.location}
                        onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Key responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Education</span>
              </label>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree</span>
              </button>
            </div>

            {educations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No education listed yet.</p>
            ) : (
              <div className="space-y-3">
                {educations.map((edu, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                      <input
                        type="text"
                        placeholder="Degree / Certificate"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Institution / University"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Year"
                        value={edu.year}
                        onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Grade / GPA"
                        value={edu.grade}
                        onChange={(e) => handleUpdateEducation(idx, 'grade', e.target.value)}
                        className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resume Upload (UI Only) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Resume Upload (PDF / DOC)</span>
            </label>
            <div className="p-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl bg-slate-50/60 text-center transition flex flex-col items-center justify-center gap-2">
              <Upload className="w-6 h-6 text-slate-400" />
              <div className="text-xs text-slate-600">
                <label className="font-bold text-blue-600 hover:underline cursor-pointer">
                  Browse files
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>{' '}
                to upload a resume document
              </div>
              <p className="text-[11px] text-slate-400">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>

              {resumeData && (
                <div className="mt-2 p-2 px-3 bg-white rounded-xl border border-blue-200 flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{resumeData.fileName}</span>
                  <span className="text-slate-400 font-normal">({resumeData.fileSize})</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
