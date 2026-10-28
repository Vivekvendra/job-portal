import React, { useState, useMemo } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { CompanyCard } from '../components/companies/CompanyCard';
import { CompanyModal } from '../components/companies/CompanyModal';
import { CompanyDetailModal } from '../components/companies/CompanyDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { StatSkeleton } from '../components/common/SkeletonLoader';

export const CompanyManagement = () => {
  const {
    companies,
    isCompaniesLoading,
    companiesError,
    apiSource,
    deleteCompany,
    refetchCompanies,
  } = useDashboard();

  // Search, Filter, Sort & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [sortBy, setSortBy] = useState('NAME_ASC'); // 'NAME_ASC', 'NAME_DESC', 'EMPLOYEES'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null);

  // Extract unique industry list
  const industries = useMemo(() => {
    const list = Array.from(new Set(companies.map((c) => c.industry))).filter(Boolean);
    return ['ALL', ...list];
  }, [companies]);

  // Filter & Sort Logic
  const filteredAndSortedCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const matchesSearch =
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesIndustry =
          selectedIndustry === 'ALL' || company.industry === selectedIndustry;

        return matchesSearch && matchesIndustry;
      })
      .sort((a, b) => {
        if (sortBy === 'NAME_ASC') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'NAME_DESC') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'EMPLOYEES') {
          const numA = parseInt(a.employees.replace(/[^0-9]/g, '')) || 0;
          const numB = parseInt(b.employees.replace(/[^0-9]/g, '')) || 0;
          return numB - numA;
        }
        return 0;
      });
  }, [companies, searchTerm, selectedIndustry, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSortedCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCompanies.slice(start, start + itemsPerPage);
  }, [filteredAndSortedCompanies, currentPage]);

  const handleOpenAdd = () => {
    setCompanyToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setCompanyToEdit(comp);
    setIsAddEditOpen(true);
  };

  const handleDelete = (comp) => {
    if (window.confirm(`Are you sure you want to delete ${comp.name}?`)) {
      deleteCompany(comp.id);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Synced with {apiSource}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Company Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover, add, edit, and organize partner enterprise employers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refetchCompanies}
            disabled={isCompaniesLoading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            title="Refresh from Third-Party API"
          >
            <RefreshCw
              className={`w-4 h-4 ${isCompaniesLoading ? 'animate-spin text-blue-600' : ''}`}
            />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Error state alert if API fails */}
      {companiesError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{companiesError}</span>
          </div>
          <button
            onClick={refetchCompanies}
            className="font-bold underline text-amber-900 hover:text-amber-700"
          >
            Retry API
          </button>
        </div>
      )}

      {/* Filter, Search & Sort Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
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
            placeholder="Search company by name, location, keyword..."
            className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Filter by Industry & Sort Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Industry Dropdown */}
          <div className="relative flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedIndustry}
              onChange={(e) => {
                setSelectedIndustry(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'ALL' ? 'All Industries' : ind}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="NAME_ASC">Name (A &rarr; Z)</option>
              <option value="NAME_DESC">Name (Z &rarr; A)</option>
              <option value="EMPLOYEES">Most Employees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Grid List / Loading Skeleton / Empty State */}
      {isCompaniesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      ) : paginatedCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies found"
          description="We couldn't find any companies matching your search and filter criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedIndustry('ALL');
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onSelect={setSelectedCompanyDetail}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredAndSortedCompanies.length > itemsPerPage && (
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-bold text-slate-800">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedCompanies.length)}
            </span>{' '}
            of <span className="font-bold text-slate-800">{filteredAndSortedCompanies.length}</span>{' '}
            companies
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

      {/* Add / Edit Company Modal */}
      <CompanyModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        companyToEdit={companyToEdit}
      />

      {/* Company Detail Modal */}
      <CompanyDetailModal
        isOpen={Boolean(selectedCompanyDetail)}
        onClose={() => setSelectedCompanyDetail(null)}
        company={selectedCompanyDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
