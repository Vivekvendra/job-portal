import React, { useState, useMemo } from 'react';
import {
  Search,
  Clock,
  Mail,
  MapPin,
  Download,
  Briefcase,
  FileText,
  UserCheck,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Modal } from '../components/common/Modal';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { EmptyState } from '../components/common/EmptyState';
import { toast } from 'react-toastify';

const HIRING_STAGES = [
  { id: 'ALL', label: 'All Stages' },
  { id: 'Submitted', label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'In Review', label: 'In Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Interview Scheduled', label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Offer Extended', label: 'Offer Extended', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export const RecruiterApplicants = () => {
  const { candidateApplications, updateCandidateStatus } = useDashboard();

  // State
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-11-04',
    time: '14:00',
    type: 'Technical Screening',
    interviewer: 'Priya Nair (Lead Recruiter)',
    meetingLink: 'https://meet.google.com/xyz-talent-review',
  });
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [recruiterNote, setRecruiterNote] = useState('');

  // Unique jobs for filter
  const jobOptions = useMemo(() => {
    const jobTitles = Array.from(new Set(candidateApplications.map((a) => a.jobTitle)));
    return ['ALL', ...jobTitles];
  }, [candidateApplications]);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return candidateApplications.filter((app) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        app.candidateName.toLowerCase().includes(term) ||
        app.jobTitle.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.skills?.some((s) => s.toLowerCase().includes(term));

      const matchesJob = selectedJobFilter === 'ALL' || app.jobTitle === selectedJobFilter;
      const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;

      return matchesSearch && matchesJob && matchesStage;
    });
  }, [candidateApplications, searchTerm, selectedJobFilter, stageFilter]);

  // Stage counts
  const stageCounts = useMemo(() => {
    const counts = { ALL: candidateApplications.length };
    candidateApplications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [candidateApplications]);

  // Inspect Candidate handler
  const handleInspectCandidate = (cand) => {
    setSelectedCandidate(cand);
    setRecruiterNote(cand.notes || '');
  };

  // Status changer handler
  const handleStageChange = (appId, newStatus) => {
    updateCandidateStatus(appId, newStatus, recruiterNote);
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Schedule Interview handler
  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const note = `Interview scheduled for ${interviewForm.date} at ${interviewForm.time} (${interviewForm.type}) with ${interviewForm.interviewer}. Link: ${interviewForm.meetingLink}`;
    updateCandidateStatus(selectedCandidate.id, 'Interview Scheduled', note);
    setIsScheduleModalOpen(false);
    toast.success(`Interview confirmed with ${selectedCandidate.candidateName}! Calendar invite dispatched.`);
  };

  // Resume Download Simulator
  const handleDownloadResume = (cand) => {
    const fileName = cand.resumeName || `${cand.candidateName.replace(/\s+/g, '_')}_Resume.pdf`;
    const dummyBlob = new Blob([`Resume Portfolio - ${cand.candidateName}\nEmail: ${cand.email}\nExperience: ${cand.experienceYears}\nSkills: ${cand.skills?.join(', ')}`], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dummyBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success(`Downloaded ${fileName}`);
  };

  // Export Applicants CSV
  const handleExportApplicants = () => {
    const csvHeader = 'Candidate Name,Email,Phone,Location,Job Title,Applied Date,Status,Match Score\n';
    const csvRows = filteredApplicants
      .map((a) => `"${a.candidateName}","${a.email}","${a.phone}","${a.location}","${a.jobTitle}","${a.appliedDate}","${a.status}","${a.matchScore}%"`)
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Inbound_Applicants_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success('Applicant records exported as CSV');
  };

  return (
    <div className="space-y-6 sm:space-y-7 text-left">
      {/* Top Header & Quick Action Area */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <UserCheck className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Inbound Applicants Pipeline
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate inbound talent, screen resumes, schedule interviews, and advance hiring stages.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-purple-600 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-purple-600 font-bold shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportApplicants}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="Export applicants as CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Post New Job Action */}
          <button
            onClick={() => setIsPostJobOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Vacancy</span>
          </button>
        </div>
      </div>

      {/* Recruiter KPI Stage Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {[
          { label: 'Total Inbound', count: stageCounts.ALL || 0, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'Screening / Review', count: stageCounts['In Review'] || 0, color: 'text-purple-600', bg: 'bg-purple-50/50 border-purple-100' },
          { label: 'Interviews Arranged', count: stageCounts['Interview Scheduled'] || 0, color: 'text-amber-600', bg: 'bg-amber-50/50 border-amber-100' },
          { label: 'Offers Extended', count: stageCounts['Offer Extended'] || 0, color: 'text-emerald-600', bg: 'bg-emerald-50/50 border-emerald-100' },
          { label: 'Not Retained', count: stageCounts['Rejected'] || 0, color: 'text-rose-600', bg: 'bg-rose-50/50 border-rose-100' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${kpi.bg}`}
          >
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {kpi.label}
            </div>
            <div className={`text-2xl font-black mt-1 ${kpi.color}`}>
              {kpi.count}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Dynamic Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates by name, job, email, skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-slate-50/50 focus:bg-white"
          />
        </div>

        {/* Filter by Job Vacancy */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              {jobOptions.map((job) => (
                <option key={job} value={job}>
                  {job === 'ALL' ? 'All Job Openings' : job}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stage Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {HIRING_STAGES.map((stg) => {
          const count = stageCounts[stg.id] || 0;
          const isSelected = stageFilter === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => setStageFilter(stg.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                  : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <span>{stg.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {HIRING_STAGES.filter((s) => s.id !== 'ALL').map((stage) => {
            const candidatesInStage = filteredApplicants.filter((a) => a.status === stage.id);

            return (
              <div
                key={stage.id}
                className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 flex flex-col space-y-3 min-h-[380px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-extrabold text-slate-800">
                      {stage.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-2xs">
                    {candidatesInStage.length}
                  </span>
                </div>

                {/* Candidate Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
                  {candidatesInStage.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs italic">
                      No candidates at this stage
                    </div>
                  ) : (
                    candidatesInStage.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => handleInspectCandidate(cand)}
                        className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer text-left space-y-2.5 group"
                      >
                        {/* Top: Avatar, Name & Match Score */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={cand.avatar}
                              alt={cand.candidateName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                                {cand.candidateName}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {cand.location}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md shrink-0">
                            {cand.matchScore}%
                          </span>
                        </div>

                        {/* Applied Job Tag */}
                        <div className="text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 truncate">
                          {cand.jobTitle}
                        </div>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap gap-1">
                          {cand.skills?.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[9px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {cand.skills?.length > 3 && (
                            <span className="text-[9px] text-slate-400">
                              +{cand.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Card Footer: Date & Advance Action */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cand.appliedDate}
                          </span>
                          <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                            Review <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: LIST / TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filteredApplicants.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No applicants found"
                description="Try clearing your filters or search keywords to view incoming candidates."
                actionText="Reset Filters"
                onAction={() => {
                  setSearchTerm('');
                  setSelectedJobFilter('ALL');
                  setStageFilter('ALL');
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Applied Position</th>
                    <th className="py-3.5 px-4">Match</th>
                    <th className="py-3.5 px-4">Experience</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Current Stage</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/70 transition">
                      {/* Candidate */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cand.avatar}
                            alt={cand.candidateName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{cand.candidateName}</div>
                            <div className="text-[11px] text-slate-400">{cand.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>{cand.jobTitle}</div>
                        <div className="text-[10px] text-slate-400">{cand.company}</div>
                      </td>

                      {/* Match Score */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px]">
                          {cand.matchScore}%
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {cand.experienceYears}
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {cand.appliedDate}
                      </td>

                      {/* Stage Dropdown Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={cand.status}
                          onChange={(e) => handleStageChange(cand.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="In Review">In Review</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer Extended">Offer Extended</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleInspectCandidate(cand)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-purple-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer shadow-2xs"
                        >
                          Review Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CANDIDATE INSPECTION & STAGE ADVANCEMENT MODAL */}
      {selectedCandidate && (
        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title="Candidate Profile & Application Review"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-left">
            {/* Header: Candidate Info & Stage */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/70 via-blue-50/50 to-slate-50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.candidateName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 bg-white shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedCandidate.candidateName}
                    </h3>
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {selectedCandidate.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">
                    Applying for: <span className="text-purple-700 font-bold">{selectedCandidate.jobTitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCandidate.email}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCandidate.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-end sm:self-center">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    selectedCandidate.status === 'Offer Extended'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedCandidate.status === 'Interview Scheduled'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : selectedCandidate.status === 'In Review'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : selectedCandidate.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {selectedCandidate.status}
                </span>
              </div>
            </div>

            {/* Resume & Credentials Bar */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {selectedCandidate.resumeName || 'Candidate_Resume.pdf'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Uploaded on {selectedCandidate.appliedDate} &bull; PDF Document
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadResume(selectedCandidate)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-purple-700 hover:bg-purple-50 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>
            </div>

            {/* Skills Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Demonstrated Competencies & Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recruiter Evaluation Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Recruiter Evaluation Notes</span>
                <span className="text-[10px] text-slate-400 font-normal">Internal only</span>
              </label>
              <textarea
                value={recruiterNote}
                onChange={(e) => setRecruiterNote(e.target.value)}
                placeholder="Add screening remarks, interview question notes, or technical observations..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            {/* Quick Action Buttons to Advance Stage */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Advance Candidate Stage
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleStageChange(selectedCandidate.id, 'In Review')}
                  className="py-2 px-3 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition cursor-pointer"
                >
                  Mark In Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Schedule Interview
                </button>
                <button
                  type="button"
                  onClick={() => handleStageChange(selectedCandidate.id, 'Offer Extended')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Extend Offer
                </button>
                <button
                  type="button"
                  onClick={() => handleStageChange(selectedCandidate.id, 'Rejected')}
                  className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {isScheduleModalOpen && selectedCandidate && (
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title={`Schedule Interview with ${selectedCandidate.candidateName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleScheduleInterview} className="space-y-4 text-left">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Booking an interview will automatically notify the candidate via email and advance their status to <strong>Interview Scheduled</strong>.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Date</label>
                <input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Time</label>
                <input
                  type="time"
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Interview Type</label>
              <select
                value={interviewForm.type}
                onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1 bg-white"
              >
                <option value="Technical Screening">Technical Screening (45 mins)</option>
                <option value="Architecture & Coding Round">Architecture & Coding Round (60 mins)</option>
                <option value="Culture & Leadership Fit">Culture & Leadership Fit (30 mins)</option>
                <option value="Final Executive Round">Final Executive Round (45 mins)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Interviewer</label>
              <input
                type="text"
                value={interviewForm.interviewer}
                onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Video Meeting Link</label>
              <input
                type="url"
                value={interviewForm.meetingLink}
                onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mt-1"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Confirm & Invite
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Post Job Modal */}
      <JobFormModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
      />
    </div>
  );
};
