import React from 'react';

export const StatSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-slate-200 rounded-xl" />
      <div className="w-16 h-6 bg-slate-200 rounded-full" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="w-24 h-4 bg-slate-200 rounded" />
      <div className="w-32 h-8 bg-slate-200 rounded" />
    </div>
  </div>
);

export const ActivitySkeleton = () => (
  <div className="p-4 flex items-center gap-3.5 border-b border-slate-100 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="w-48 h-4 bg-slate-200 rounded" />
      <div className="w-24 h-3 bg-slate-200 rounded" />
    </div>
    <div className="w-16 h-6 bg-slate-200 rounded-full" />
  </div>
);

export const JobCardSkeleton = () => (
  <div className="p-5 bg-white rounded-2xl border border-slate-200/80 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200" />
        <div className="space-y-1.5">
          <div className="w-36 h-4 bg-slate-200 rounded" />
          <div className="w-24 h-3 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-slate-200" />
    </div>
    <div className="flex gap-2">
      <div className="w-20 h-6 bg-slate-200 rounded-md" />
      <div className="w-24 h-6 bg-slate-200 rounded-md" />
      <div className="w-20 h-6 bg-slate-200 rounded-md" />
    </div>
  </div>
);
