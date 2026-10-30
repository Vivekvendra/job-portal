import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  FileSpreadsheet,
  Code,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { toast } from 'react-toastify';

export const ExportReportModal = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('pdf');
  const [timeframe, setTimeframe] = useState('30days');
  const [sections, setSections] = useState({
    summary: true,
    monthlyStats: true,
    mostApplied: true,
    pipeline: true,
    companyMetrics: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      onClose();

      // Trigger simulated file download
      const fileName = `Talent_Analytics_Report_${new Date().toISOString().split('T')[0]}.${format}`;
      const dummyContent = format === 'json'
        ? JSON.stringify({ report: 'Talent Acquisition Analytics', generatedAt: new Date().toISOString(), sections }, null, 2)
        : `Talent Acquisition Executive Summary\nGenerated: ${new Date().toLocaleString()}\nTimeframe: ${timeframe}\nFormat: ${format.toUpperCase()}`;

      const blob = new Blob([dummyContent], { type: format === 'json' ? 'application/json' : 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success(`Report downloaded successfully as ${fileName}`);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Talent Analytics Report" maxWidth="max-w-xl">
      <div className="space-y-6 text-left">
        {/* Intro */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900">Customized Executive Export</div>
            <p className="text-slate-600 mt-0.5">
              Select your desired file format, reporting timeframe, and data sections to download an executive-ready analytics summary.
            </p>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'pdf', label: 'PDF Document', desc: 'Executive Summary', icon: FileText, color: 'text-rose-600' },
              { id: 'csv', label: 'CSV Spreadsheet', desc: 'Raw Datasets', icon: FileSpreadsheet, color: 'text-emerald-600' },
              { id: 'json', label: 'JSON Payload', desc: 'API Integration', icon: Code, color: 'text-indigo-600' },
            ].map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = format === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setFormat(fmt.id)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${fmt.color}`} />
                    {isSelected && <CheckCircle className="w-4 h-4 text-blue-600 fill-blue-50" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{fmt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{fmt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeframe Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Reporting Period
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="30days">Last 30 Days (Current Cycle)</option>
            <option value="6months">Last 6 Months (H1 / H2 Trend)</option>
            <option value="year">Full Year 2026 (Annual Review)</option>
            <option value="all">All-Time Historical Telemetry</option>
          </select>
        </div>

        {/* Included Data Sections */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Include Sections
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'summary', label: 'Primary KPI Metrics', desc: 'Totals & Growth Rates' },
              { key: 'monthlyStats', label: 'Monthly Inbound Telemetry', desc: 'Applications & Hires' },
              { key: 'mostApplied', label: 'Most Applied Positions', desc: 'Top Ranking Vacancies' },
              { key: 'pipeline', label: 'Application Pipeline', desc: 'Conversion Funnel Stages' },
              { key: 'companyMetrics', label: 'Company Recruitment Index', desc: 'Enterprise Breakdown' },
            ].map((sec) => (
              <label
                key={sec.key}
                onClick={() => toggleSection(sec.key)}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition ${
                  sections[sec.key]
                    ? 'border-blue-200 bg-blue-50/40 text-slate-900'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={sections[sec.key]}
                  onChange={() => {}} // Controlled by label click
                  className="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <div className="min-w-0">
                  <div className="font-bold">{sec.label}</div>
                  <div className="text-[10px] text-slate-500">{sec.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Preparing Export...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
