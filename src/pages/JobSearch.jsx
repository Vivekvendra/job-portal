import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
  Award,
  RotateCcw,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { JobSearchCard } from '../components/jobs/JobSearchCard';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { EmptyState } from '../components/common/EmptyState';

// Popular tech locations
const PRESET_LOCATIONS = [
  'ALL',
  'Remote',
  'San Francisco, CA',
  'Mountain View, CA',
  'Austin, TX',
  'New York, NY',
  'Seattle, WA',
  'Chicago, IL',
  'Boston, MA',
  'Los Angeles, CA',
];

const JOB_TYPES = [
  'ALL',
  'Full-time',
  'Hybrid',
  'Remote',
  'Part-Time',
  'Contract',
  'Internship',
];

const EXPERIENCE_LEVELS = [
  'ALL',
  'Entry-Level',
  'Mid-Level (3+ yrs)',
  'Senior (5+ yrs)',
  'Lead / Principal',
];

const SALARY_TIERS = [
  { label: 'Any Compensation', value: 0 },
  { label: '$50,000+ / yr', value: 50000 },
  { label: '$80,000+ / yr', value: 80000 },
  { label: '$100,000+ / yr', value: 100000 },
  { label: '$120,000+ / yr', value: 120000 },
  { label: '$150,000+ / yr', value: 150000 },
  { label: '$180,000+ / yr', value: 180000 },
];

export const JobSearch = () => {
  const { jobs } = useDashboard();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('ALL');
  const [selectedExperience, setSelectedExperience] = useState('ALL');
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('LATEST'); // 'LATEST', 'SALARY_DESC', 'SALARY_ASC', 'TITLE_ASC'
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Detail Modal State
  const [selectedJob, setSelectedJob] = useState(null);

  const itemsPerPage = 6;

  // Helper to extract numeric maximum salary for sorting and filtering
  const extractSalaryMax = (salaryStr) => {
    if (!salaryStr) return 0;
    const matches = salaryStr.match(/\d+[\d,]*/g);
    if (!matches) return 0;
    const lastNum = matches[matches.length - 1].replace(/,/g, '');
    return parseInt(lastNum, 10) || 0;
  };

  // Filter and Sort Pipeline
  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // 1. Text Search (title, company, location, skills, description)
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          (Array.isArray(job.skills) &&
            job.skills.some((s) => s.toLowerCase().includes(term)));

        // 2. Location Filter
        let matchesLocation = true;
        if (customLocation.trim()) {
          matchesLocation = job.location
            .toLowerCase()
            .includes(customLocation.toLowerCase().trim());
        } else if (selectedLocation !== 'ALL') {
          matchesLocation =
            selectedLocation === 'Remote'
              ? job.location.toLowerCase().includes('remote') ||
                job.type.toLowerCase().includes('remote')
              : job.location.toLowerCase().includes(selectedLocation.toLowerCase());
        }

        // 3. Job Type Filter
        const matchesJobType =
          selectedJobType === 'ALL' ||
          job.type.toLowerCase() === selectedJobType.toLowerCase() ||
          (selectedJobType === 'Remote' &&
            job.location.toLowerCase().includes('remote'));

        // 4. Experience Level Filter
        const matchesExperience =
          selectedExperience === 'ALL' ||
          job.experience.toLowerCase().includes(selectedExperience.toLowerCase().split(' ')[0]);

        // 5. Salary Range Filter
        const salaryMax = extractSalaryMax(job.salary);
        const matchesSalary = minSalary === 0 || salaryMax >= minSalary;

        return (
          matchesSearch &&
          matchesLocation &&
          matchesJobType &&
          matchesExperience &&
          matchesSalary
        );
      })
      .sort((a, b) => {
        if (sortBy === 'LATEST') {
          // Sort by id descending (highest/newest first)
          const numA = parseInt((a.id || '').replace(/[^0-9]/g, '')) || 0;
          const numB = parseInt((b.id || '').replace(/[^0-9]/g, '')) || 0;
          return numB - numA;
        }
        if (sortBy === 'SALARY_DESC') {
          return extractSalaryMax(b.salary) - extractSalaryMax(a.salary);
        }
        if (sortBy === 'SALARY_ASC') {
          return extractSalaryMax(a.salary) - extractSalaryMax(b.salary);
        }
        if (sortBy === 'TITLE_ASC') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [
    jobs,
    searchTerm,
    selectedLocation,
    customLocation,
    selectedJobType,
    selectedExperience,
    minSalary,
    sortBy,
  ]);

  // Pagination Math
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedJobs = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedJobs, safeCurrentPage]);

  // Clear all filters helper
  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedLocation('ALL');
    setCustomLocation('');
    setSelectedJobType('ALL');
    setSelectedExperience('ALL');
    setMinSalary(0);
    setSortBy('LATEST');
    setCurrentPage(1);
  };

  // Check if any filter is actively applied
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedLocation !== 'ALL' ||
    Boolean(customLocation) ||
    selectedJobType !== 'ALL' ||
    selectedExperience !== 'ALL' ||
    minSalary > 0;

  // Handle skill tag click to quickly filter
  const handleSkillClick = (skill) => {
    setSearchTerm(skill);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Opportunities &bull; Smart Job Search</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Your Next Career Move
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Discover verified opportunities from industry leaders. Filter by location, job type,
              experience level, and compensation range.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">
                Total Positions
              </span>
              <span className="text-lg font-extrabold text-slate-900">{jobs.length}</span>
            </div>
            <div className="px-4 py-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-left">
              <span className="text-[11px] font-bold text-emerald-600 uppercase block">
                Open & Hiring
              </span>
              <span className="text-lg font-extrabold text-emerald-700">
                {jobs.filter((j) => j.status === 'Open').length}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Search Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-stretch gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, skills (e.g. React, Python), or keywords..."
              className="w-full py-3 pl-11 pr-10 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Quick Input */}
          <div className="relative md:w-64">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={customLocation}
              onChange={(e) => {
                setCustomLocation(e.target.value);
                setSelectedLocation('ALL');
              }}
              placeholder="City, state, or remote..."
              className="w-full py-3 pl-10 pr-9 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition shadow-xs"
            />
            {customLocation && (
              <button
                type="button"
                onClick={() => setCustomLocation('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="lg:hidden px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '&bull; Active'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar (Desktop) + Jobs Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6 ${
            isFilterDrawerOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Filter Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900">Filter Search</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* 1. Location Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Location</span>
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {PRESET_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation === loc && !customLocation;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setCustomLocation('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{loc === 'ALL' ? 'All Locations' : loc}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Job Type Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Employment Type</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {JOB_TYPES.map((type) => {
                const isSelected = selectedJobType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedJobType(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-center truncate cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                    }`}
                  >
                    {type === 'ALL' ? 'All Types' : type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Experience Level Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Experience Level</span>
            </label>
            <div className="space-y-1.5">
              {EXPERIENCE_LEVELS.map((exp) => {
                const isSelected = selectedExperience === exp;
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setSelectedExperience(exp)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{exp === 'ALL' ? 'All Experience Levels' : exp}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Salary Range Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Minimum Salary</span>
            </label>
            <div className="space-y-1.5">
              {SALARY_TIERS.map((tier) => {
                const isSelected = minSalary === tier.value;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setMinSalary(tier.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tier.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Area: Results Header, Sort, Active Chips & Cards Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Results Summary & Sort By Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredAndSortedJobs.length}</span>{' '}
              positions matching your preferences
            </div>

            {/* Sort by Latest Jobs / Salary */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-400 uppercase">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="LATEST">Latest Postings</option>
                <option value="SALARY_DESC">Highest Salary ($$$ &rarr; $)</option>
                <option value="SALARY_ASC">Lowest Salary ($ &rarr; $$$)</option>
                <option value="TITLE_ASC">Job Title (A &rarr; Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
              <span className="font-bold text-blue-900 text-[11px] uppercase mr-1">Active:</span>

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold">
                  Keyword: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLocation !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation('ALL')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {customLocation && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold">
                  Location: "{customLocation}"
                  <button onClick={() => setCustomLocation('')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedJobType !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold">
                  Type: {selectedJobType}
                  <button onClick={() => setSelectedJobType('ALL')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedExperience !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold">
                  Level: {selectedExperience}
                  <button
                    onClick={() => setSelectedExperience('ALL')}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {minSalary > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 font-semibold">
                  Min: ${minSalary.toLocaleString()}
                  <button onClick={() => setMinSalary(0)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="ml-auto text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Jobs Cards Feed or Empty State */}
          {paginatedJobs.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching job listings found"
              description="Try relaxing your salary threshold, switching locations, or clearing your keyword filter."
              actionText="Reset All Filters"
              onAction={handleClearAllFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedJobs.map((job) => (
                <JobSearchCard
                  key={job.id}
                  job={job}
                  onSelectJob={setSelectedJob}
                  onSkillClick={handleSkillClick}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredAndSortedJobs.length > itemsPerPage && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between mt-6">
              <div className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
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
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail View Modal */}
      <JobDetailModal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
      />
    </div>
  );
};
