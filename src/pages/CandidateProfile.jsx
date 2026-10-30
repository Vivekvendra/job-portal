import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Edit,
  Download,
  CheckCircle2,
  Calendar,
  Building,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { ProfileEditModal } from '../components/profile/ProfileEditModal';
import { toast } from 'react-toastify';

export const CandidateProfile = () => {
  const { user } = useAuth();
  const { applications, savedJobs } = useDashboard();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Compute profile completion percentage
  const calculateCompletion = () => {
    let score = 20; // base registered
    if (user?.name) score += 15;
    if (user?.email) score += 15;
    if (user?.mobile) score += 10;
    if (user?.address) score += 10;
    if (Array.isArray(user?.skills) && user.skills.length > 0) score += 10;
    if (Array.isArray(user?.experience) && user.experience.length > 0) score += 10;
    if (user?.resume) score += 10;
    return Math.min(score, 100);
  };

  const completionRate = calculateCompletion();

  const handleDownloadResume = () => {
    if (user?.resume) {
      toast.info(`Downloading ${user.resume.fileName}...`);
    } else {
      toast.warning('No resume file uploaded yet. Click "Edit Profile" to upload one.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 text-left">
      {/* Profile Header Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar and Basic Details */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80'
                }
                alt={user?.name || 'Candidate'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md bg-white"
              />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user?.name || 'Sarah Jenkins'}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {user?.role || 'Candidate'}
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600">
                {user?.title || 'Senior Frontend Developer'}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user?.address || 'San Francisco, CA'}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user?.email || 'candidate@jobportal.com'}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user?.mobile || '+1 (555) 234-5678'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Profile Strength & Readiness</span>
            </span>
            <span className="font-extrabold text-blue-600">{completionRate}% Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Applications</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{applications.length}</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">Active Pipeline</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Saved Positions</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{savedJobs.length}</span>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">Bookmarked</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Verified Skills</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{user?.skills?.length || 0}</span>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">Competencies</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Candidate Status</span>
          <span className="text-sm font-extrabold text-emerald-600 mt-2 block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Ready to Interview
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Open to opportunities</span>
        </div>
      </div>

      {/* Two Column Layout: Main Details (Left) & Resume / Quick Contact (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
        {/* Left Column (8 cols): Bio, Experience & Education */}
        <div className="lg:col-span-8 space-y-6">
          {/* About / Professional Bio */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-left space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Professional Summary</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {user?.bio ||
                'Passionate software engineer experienced in designing user-centric web applications, scalable client architectures, and robust engineering workflows.'}
            </p>
          </div>

          {/* Work Experience Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Work Experience</span>
              </h3>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                + Add Experience
              </button>
            </div>

            {!user?.experience || user.experience.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No work experience entries yet.</p>
            ) : (
              <div className="space-y-6 pt-2">
                {user.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative pl-6 border-l-2 border-blue-200 space-y-1">
                    <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{exp.title}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {exp.duration}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-blue-500" />
                      {exp.company}
                      {exp.location && (
                        <span className="text-slate-400 font-normal">&bull; {exp.location}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education & Credentials */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Education & Credentials</span>
              </h3>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                + Add Education
              </button>
            </div>

            {!user?.education || user.education.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No education history added yet.</p>
            ) : (
              <div className="space-y-4 pt-1">
                {user.education.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{edu.institution}</p>
                      {edu.grade && (
                        <span className="text-[11px] font-semibold text-emerald-700 inline-block mt-1">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 self-start sm:self-auto">
                      {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Skills & Resume Document */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skills Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Skills & Tech Stack</span>
              </h3>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>

            {!user?.skills || user.skills.length === 0 ? (
              <p className="text-xs text-slate-400">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Resume Upload (UI Only) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Uploaded Resume</span>
              </h3>
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Replace
              </button>
            </div>

            {user?.resume ? (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {user.resume.fileName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {user.resume.fileSize} &bull; Uploaded {user.resume.uploadDate}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
              </div>
            ) : (
              <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs text-slate-600 font-medium">No resume attached</div>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* Quick Contact Overview */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-left space-y-3 shadow-md shadow-blue-500/10">
            <h4 className="text-sm font-bold">Candidate Contact Info</h4>
            <div className="space-y-2 text-xs text-blue-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span>{user?.mobile || '+1 (555) 234-5678'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span>{user?.address || 'San Francisco, CA'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
};
