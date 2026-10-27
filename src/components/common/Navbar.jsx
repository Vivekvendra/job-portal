import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ isTransparent = false }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav
      className={`w-full z-30 transition-all ${
        isTransparent
          ? 'bg-transparent text-white'
          : 'bg-white text-slate-900 border-b border-slate-200 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-2xl tracking-tight">
            <span className={`font-bold ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
              Job
            </span>
            <span className={`font-semibold ${isTransparent ? 'text-white' : 'text-slate-800'}`}>
              Portal
            </span>
          </div>
        </Link>

        {/* Center / Right Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-blue-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-blue-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            Jobs
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-blue-500 ${
              isTransparent ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            Companies
          </Link>

          {/* Auth Action */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className={`p-2 rounded-lg transition ${
                  isTransparent
                    ? 'hover:bg-white/10 text-white/80'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-sm font-medium px-6 py-2 rounded-lg border transition-all ${
                isTransparent
                  ? 'border-white/80 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
