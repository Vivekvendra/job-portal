import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Building2,
  Briefcase,
  Users,
  FileCheck,
  CheckCircle2,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  Search,
  Eye,
  Clock,
  MapPin,
  PieChart,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { ExportReportModal } from '../components/reports/ExportReportModal';
import { EmptyState } from '../components/common/EmptyState';
import { toast } from 'react-toastify';

// Monthly telemetry dataset for charts & tables
const MONTHLY_STATS_DATA = [
  { month: 'Jan', applications: 150, screened: 95, interviewed: 52, hired: 35, rate: '23.3%', trend: '+8%' },
  { month: 'Feb', applications: 180, screened: 110, interviewed: 64, hired: 45, rate: '25.0%', trend: '+20%' },
  { month: 'Mar', applications: 450, screened: 260, interviewed: 135, hired: 90, rate: '20.0%', trend: '+150%' },
  { month: 'Apr', applications: 380, screened: 230, interviewed: 115, hired: 80, rate: '21.0%', trend: '-15%' },
  { month: 'May', applications: 640, screened: 390, interviewed: 195, hired: 140, rate: '21.8%', trend: '+68%' },
  { month: 'Jun', applications: 920, screened: 570, interviewed: 290, hired: 210, rate: '22.8%', trend: '+43%' },
  { month: 'Jul', applications: 760, screened: 480, interviewed: 245, hired: 180, rate: '23.6%', trend: '-17%' },
];

// Category share breakdown
const CATEGORY_DISTRIBUTION = [
  { name: 'Engineering & Cloud', percentage: 38, count: 3237, color: 'bg-blue-600', textColor: 'text-blue-600' },
  { name: 'Data & Artificial Intelligence', percentage: 24, count: 2045, color: 'bg-indigo-600', textColor: 'text-indigo-600' },
  { name: 'Product & Operations', percentage: 16, count: 1363, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { name: 'UI/UX & Product Design', percentage: 12, count: 1022, color: 'bg-purple-500', textColor: 'text-purple-600' },
  { name: 'Technical Content & Marketing', percentage: 10, count: 853, color: 'bg-amber-500', textColor: 'text-amber-600' },
];

export const ReportsManagement = () => {
  const { stats, jobs } = useDashboard();

  // State management
  const [timeframe, setTimeframe] = useState('6months');
  const [chartType, setChartType] = useState('spline'); // 'spline' or 'bar'
  const [activeMonthPoint, setActiveMonthPoint] = useState(null);
  const [searchJobQuery, setSearchJobQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh data simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Analytics telemetry refreshed with latest data');
    }, 600);
  };

  const handlePrint = () => {
    toast.info('Preparing print preview...');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Derive Most Applied Jobs sorted by applicantsCount descending
  const mostAppliedJobs = useMemo(() => {
    const list = [...jobs];
    list.sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0));

    return list.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchJobQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchJobQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchJobQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' || job.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchJobQuery, categoryFilter]);

  // Extract all unique categories
  const categoriesList = useMemo(() => {
    const set = new Set(jobs.map((j) => j.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [jobs]);

  // SVG Chart Dimensions & coordinates
  // ViewBox: 0 0 500 200
  // Left: 30, Right: 470, Bottom: 180, Top: 25
  const chartCoordinates = useMemo(() => {
    const maxVal = 1000;
    const width = 440;
    const step = width / (MONTHLY_STATS_DATA.length - 1);

    return MONTHLY_STATS_DATA.map((item, idx) => {
      const x = 30 + idx * step;
      const y = 180 - (item.applications / maxVal) * 150;
      const yHired = 180 - (item.hired / maxVal) * 150;
      return { ...item, x, y, yHired };
    });
  }, []);

  const splinePath = useMemo(() => {
    if (chartCoordinates.length === 0) return '';
    return chartCoordinates.reduce((acc, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[idx - 1];
      const cp1x = prev.x + (pt.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (pt.x - prev.x) / 2;
      const cp2y = pt.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
    }, '');
  }, [chartCoordinates]);

  const areaPath = useMemo(() => {
    if (!splinePath || chartCoordinates.length === 0) return '';
    const last = chartCoordinates[chartCoordinates.length - 1];
    const first = chartCoordinates[0];
    return `${splinePath} L ${last.x} 185 L ${first.x} 185 Z`;
  }, [splinePath, chartCoordinates]);

  return (
    <div className="space-y-6 sm:space-y-8 text-left">
      {/* Top Header & Executive Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Reports & Talent Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time performance metrics, recruitment pipelines, and application trends.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Timeframe pills */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-600">
            {[
              { id: '30days', label: '30D' },
              { id: '6months', label: '6M' },
              { id: 'year', label: '1Y' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="Print summary"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Export Report button */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Job Postings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8.2%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalJobs.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Total Job Postings
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active across all categories
            </div>
          </div>
        </div>

        {/* Total Companies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalCompanies.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Total Companies
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Verified employer accounts
            </div>
          </div>
        </div>

        {/* Total Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +15.7%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalCandidates.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Total Candidates
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Global registered talent
            </div>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +22.5%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalApplications.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Total Applications
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Inbound submissions received
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              94% Open
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {stats.activeJobPostings.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Active Jobs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Currently accepting resumes
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Application Statistics & Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Chart Column (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Monthly Application Statistics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison of monthly candidate applications received versus successful hires
                </p>
              </div>

              {/* View options and legend */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Applications</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Hired</span>
                  </div>
                </div>

                <div className="inline-flex p-0.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setChartType('spline')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      chartType === 'spline' ? 'bg-white text-blue-600 font-bold shadow-xs' : ''
                    }`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      chartType === 'bar' ? 'bg-white text-blue-600 font-bold shadow-xs' : ''
                    }`}
                  >
                    Bars
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="relative w-full overflow-hidden">
              {/* Tooltip */}
              {activeMonthPoint && (
                <div
                  className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 bg-slate-900 text-white text-[11px] font-semibold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap"
                  style={{
                    left: `${(activeMonthPoint.x / 500) * 100}%`,
                    top: `${(activeMonthPoint.y / 200) * 100}%`,
                  }}
                >
                  <div className="font-bold text-blue-300 text-xs border-b border-slate-700 pb-1 mb-1">
                    {activeMonthPoint.month} Performance
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300">Applications:</span>
                    <span className="font-bold text-white">{activeMonthPoint.applications}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300">Hires:</span>
                    <span className="font-bold text-emerald-400">{activeMonthPoint.hired}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                    <span>Acceptance:</span>
                    <span className="font-bold text-blue-200">{activeMonthPoint.rate}</span>
                  </div>
                </div>
              )}

              <div className="flex items-stretch">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-3 pb-7 select-none text-right w-10 shrink-0">
                  <span>1,000</span>
                  <span>750</span>
                  <span>500</span>
                  <span>250</span>
                  <span>0</span>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 relative">
                  {chartType === 'spline' ? (
                    <svg viewBox="0 0 500 200" className="w-full h-56 overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="20" y1="30" x2="480" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="67" x2="480" y2="67" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="105" x2="480" y2="105" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="142" x2="480" y2="142" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="180" x2="480" y2="180" stroke="#E2E8F0" strokeWidth="1.2" />

                      {/* Area Fill */}
                      <path d={areaPath} fill="url(#appGradient)" />

                      {/* Spline Path */}
                      <path
                        d={splinePath}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data points */}
                      {chartCoordinates.map((pt, idx) => {
                        const isHovered = activeMonthPoint?.month === pt.month;
                        return (
                          <g
                            key={idx}
                            onMouseEnter={() => setActiveMonthPoint(pt)}
                            onMouseLeave={() => setActiveMonthPoint(null)}
                            className="cursor-pointer"
                          >
                            <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                            {isHovered && (
                              <circle cx={pt.x} cy={pt.y} r="8" fill="#3B82F6" fillOpacity="0.3" className="animate-ping" />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered ? '6' : '4'}
                              fill="#2563EB"
                              stroke="#FFFFFF"
                              strokeWidth="2.5"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  ) : (
                    /* Bar Chart Mode */
                    <div className="h-56 flex items-end justify-between px-4 pb-2 border-b border-slate-200">
                      {MONTHLY_STATS_DATA.map((item, idx) => {
                        const maxVal = 1000;
                        const appHeight = `${(item.applications / maxVal) * 100}%`;
                        const hiredHeight = `${(item.hired / maxVal) * 100}%`;
                        const isHovered = activeMonthPoint?.month === item.month;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setActiveMonthPoint(item)}
                            onMouseLeave={() => setActiveMonthPoint(null)}
                            className="flex items-end gap-1.5 h-full group cursor-pointer"
                          >
                            {/* Applications Bar */}
                            <div className="relative flex flex-col items-center">
                              <div
                                style={{ height: appHeight }}
                                className={`w-4 sm:w-6 rounded-t-lg transition-all ${
                                  isHovered ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                              />
                            </div>
                            {/* Hired Bar */}
                            <div className="relative flex flex-col items-center">
                              <div
                                style={{ height: hiredHeight }}
                                className={`w-3 sm:w-4 rounded-t-lg transition-all ${
                                  isHovered ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* X-Axis Month Labels */}
                  <div className="flex justify-between px-2 pt-2 text-[11px] font-semibold text-slate-400 select-none">
                    {MONTHLY_STATS_DATA.map((pt) => (
                      <span
                        key={pt.month}
                        className={`transition-colors ${
                          activeMonthPoint?.month === pt.month ? 'font-bold text-blue-600' : ''
                        }`}
                      >
                        {pt.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick highlight cards under chart */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Peak Inbound</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">June (920 apps)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Average Volume</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">490 apps / mo</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Offer Acceptance</div>
              <div className="text-sm font-extrabold text-emerald-600 mt-0.5">78.4%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] text-slate-400 font-medium">Time-to-Hire</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">18 Days</div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Category Breakdown & Pipeline Funnel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          {/* Category Distribution Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                Category Distribution
              </h4>
              <span className="text-xs font-semibold text-slate-400">Total Postings</span>
            </div>

            {/* Composite Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex mb-5">
              {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                <div
                  key={idx}
                  style={{ width: `${cat.percentage}%` }}
                  className={`${cat.color} transition-all hover:opacity-80`}
                  title={`${cat.name}: ${cat.percentage}%`}
                />
              ))}
            </div>

            {/* Category Items List */}
            <div className="space-y-3">
              {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                    <span className="font-semibold text-slate-700 truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-slate-400 font-medium">{cat.count.toLocaleString()}</span>
                    <span className={`font-bold ${cat.textColor}`}>{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruitment Funnel Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Recruitment Funnel
              </h4>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Conversion: 2.1%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Job Impressions', count: '185.4K', bar: '100%', color: 'bg-blue-600' },
                { label: 'Applications Submitted', count: '12.8K', bar: '60%', color: 'bg-indigo-600' },
                { label: 'Screened & Qualified', count: '4.2K', bar: '38%', color: 'bg-purple-500' },
                { label: 'Interviews Scheduled', count: '1.4K', bar: '22%', color: 'bg-amber-500' },
                { label: 'Final Offers & Hires', count: '275', bar: '12%', color: 'bg-emerald-500' },
              ].map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>{step.label}</span>
                    <span className="font-bold text-slate-900">{step.count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: step.bar }}
                      className={`h-full rounded-full ${step.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Most Applied Jobs Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Most Applied Jobs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Top job postings ranked by inbound candidate interest and applicant volume
            </p>
          </div>

          {/* Search & Category Filter within Most Applied */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchJobQuery}
                onChange={(e) => setSearchJobQuery(e.target.value)}
                placeholder="Search job or company..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            <div className="relative">
              <Filter className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Most Applied Jobs List */}
        {mostAppliedJobs.length === 0 ? (
          <EmptyState
            title="No matching job postings"
            description="Try changing your search terms or category filter to view ranking metrics."
            actionText="Clear Filters"
            onAction={() => {
              setSearchJobQuery('');
              setCategoryFilter('All');
            }}
          />
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {mostAppliedJobs.slice(0, 7).map((job, idx) => {
              const rank = idx + 1;

              return (
                <div
                  key={job.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        rank === 1
                          ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-xs'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : rank === 3
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{rank}
                    </div>

                    {/* Company Logo */}
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-white shrink-0 shadow-xs"
                    />

                    {/* Job Title & Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors truncate">
                          {job.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            job.status === 'Open'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="font-semibold text-slate-700">{job.company}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                        <span>&bull;</span>
                        <span className="text-emerald-600 font-semibold">{job.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Applicants Count & View Action */}
                  <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{job.applicantsCount || 0} Applicants</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Deadline: {job.deadline}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedJobForModal(job)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer shadow-xs"
                      title="Inspect job posting"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Application Statistics Detailed Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Historical Inbound Performance Table
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive telemetry covering submissions, screening ratios, and final hires
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            January - July 2026 Audit
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Reporting Month</th>
                <th className="py-3 px-4">Applications Received</th>
                <th className="py-3 px-4">Screened & Passed</th>
                <th className="py-3 px-4">Interviews Conducted</th>
                <th className="py-3 px-4">Successful Hires</th>
                <th className="py-3 px-4">Hire Rate</th>
                <th className="py-3 px-4">Monthly Momentum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MONTHLY_STATS_DATA.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.month} 2026</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{row.applications.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.screened}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.interviewed}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{row.hired}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{row.rate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        row.trend.startsWith('+')
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Modal for Most Applied Jobs inspection */}
      <JobDetailModal
        isOpen={!!selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
        job={selectedJobForModal}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
