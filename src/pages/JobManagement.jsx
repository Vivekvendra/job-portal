import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  PlusCircle,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { JobPostingCard } from '../components/jobs/JobPostingCard';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { EmptyState } from '../components/common/EmptyState';

export const JobManagement = () => {
  const { jobs, deleteJob } = useDashboard();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // 'ALL', 'Open', 'Closed'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedExperience, setSelectedExperience] = useState('ALL');
  const [sortBy, setSortBy] = useState('LATEST'); // 'LATEST', 'SALARY_HIGH'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Extract Categories, Types, Experiences
  const categories = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.category))).filter(Boolean);
    return ['ALL', ...list];
  }, [jobs]);

  const employmentTypes = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.type))).filter(Boolean);
    return ['ALL', ...list];
  }, [jobs]);

  const experienceLevels = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.experience))).filter(Boolean);
    return ['ALL', ...list];
  }, [jobs]);

  // Filter & Sort Jobs
  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(job.skills) &&
            job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus =
          selectedStatus === 'ALL' || job.status === selectedStatus;
        const matchesCategory =
          selectedCategory === 'ALL' || job.category === selectedCategory;
        const matchesType =
          selectedType === 'ALL' || job.type === selectedType;
        const matchesExperience =
          selectedExperience === 'ALL' || job.experience === selectedExperience;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory &&
          matchesType &&
          matchesExperience
        );
      })
      .sort((a, b) => {
        if (sortBy === 'LATEST') {
          return (b.id || '').localeCompare(a.id || '');
        }
        if (sortBy === 'SALARY_HIGH') {
          const numA = parseInt((a.salary || '').replace(/[^0-9]/g, '')) || 0;
          const numB = parseInt((b.salary || '').replace(/[^0-9]/g, '')) || 0;
          return numB - numA;
        }
        return 0;
      });
  }, [
    jobs,
    searchTerm,
    selectedStatus,
    selectedCategory,
    selectedType,
    selectedExperience,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const handleOpenAdd = () => {
    setJobToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (job) => {
    setJobToEdit(job);
    setIsAddEditOpen(true);
  };

  const handleDelete = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      deleteJob(job.id);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Module 4 Active &bull; Job Posting Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Job Posting & Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, edit, toggle status, and manage active job listings
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer active:scale-95 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Filter, Search & Status Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Top Row: Search and Status Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by job title, company, skills, location..."
              className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Status Tabs (All, Open, Closed) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            {['ALL', 'Open', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Category, Type, Experience & Sort Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100 text-xs sm:text-sm">
          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
            >
              {employmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Experience:</span>
            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
            >
              {experienceLevels.map((exp) => (
                <option key={exp} value={exp}>
                  {exp === 'ALL' ? 'All Levels' : exp}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="LATEST">Latest Postings</option>
              <option value="SALARY_HIGH">Highest Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Grid / Empty State */}
      {paginatedJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings match your filters"
          description="Try broadening your category, experience, or search terms to discover more opportunities."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedStatus('ALL');
            setSelectedCategory('ALL');
            setSelectedType('ALL');
            setSelectedExperience('ALL');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedJobs.map((job) => (
            <JobPostingCard
              key={job.id}
              job={job}
              onSelect={setSelectedJobDetail}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredAndSortedJobs.length > itemsPerPage && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-bold text-slate-800">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedJobs.length)}
            </span>{' '}
            of <span className="font-bold text-slate-800">{filteredAndSortedJobs.length}</span>{' '}
            jobs
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Job Modal */}
      <JobFormModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        jobToEdit={jobToEdit}
      />

      {/* Job Details Modal */}
      <JobDetailModal
        isOpen={Boolean(selectedJobDetail)}
        onClose={() => setSelectedJobDetail(null)}
        job={selectedJobDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
