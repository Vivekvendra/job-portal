import React from 'react';
import {
  Building2,
  Briefcase,
  FileText,
  Users,
  FileCheck,
  Bookmark,
} from 'lucide-react';
import { AdminStatCard } from './AdminStatCard';

const STATS_ROW_1 = [
  {
    title: 'Total Companies',
    value: '1,250',
    icon: Building2,
    iconBg: 'bg-blue-600',
    cardBg: 'bg-white',
    borderColor: 'border-slate-100',
  },
  {
    title: 'Total Jobs',
    value: '8,420',
    icon: Briefcase,
    iconBg: 'bg-teal-500',
    cardBg: 'bg-white',
    borderColor: 'border-slate-100',
  },
  {
    title: 'Active Job Postings',
    value: '2,180',
    icon: FileText,
    iconBg: 'bg-amber-500',
    cardBg: 'bg-[#FEFCE8]',
    borderColor: 'border-amber-200/50',
  },
  {
    title: 'Total Candidates',
    value: '24,560',
    icon: Users,
    iconBg: 'bg-violet-500',
    cardBg: 'bg-[#F8F7FF]',
    borderColor: 'border-violet-100/60',
  },
];

const STATS_ROW_2 = [
  {
    title: 'Total Applications',
    value: '12,840',
    icon: FileCheck,
    iconBg: 'bg-rose-500',
    cardBg: 'bg-white',
    borderColor: 'border-slate-100',
  },
  {
    title: 'Saved Jobs',
    value: '1,460',
    icon: Bookmark,
    iconBg: 'bg-sky-500',
    cardBg: 'bg-white',
    borderColor: 'border-slate-100',
  },
];

export const AdminStatsGrid = () => {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Row 1: 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STATS_ROW_1.map((stat, idx) => (
          <AdminStatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Row 2: 2 Cards (aligned with first 2 columns on lg screens matching the reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STATS_ROW_2.map((stat, idx) => (
          <AdminStatCard key={idx} {...stat} />
        ))}
      </div>
    </div>
  );
};
