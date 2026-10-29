import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Briefcase,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Candidate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password, data.rememberMe, selectedRole);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}! Logged in as ${res.user.role}.`);
        navigate(from, { replace: true });
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (role) => {
    setSelectedRole(role);
    if (role === 'Candidate') {
      setValue('email', 'candidate@jobportal.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'recruiter@jobportal.com');
      setValue('password', 'password123');
    }
    toast.info(`Filled credentials for ${role} account.`);
  };

  return (
    <div className="relative h-screen max-h-screen w-full overflow-hidden flex flex-col justify-between bg-slate-950 font-sans select-none antialiased">
      {/* Background Image: Optimistic Professional in Modern Office from public folder */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/Optimistic%20Professional%20in%20Modern%20Office.png"
          alt="Optimistic Professional in Modern Office"
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Selective Left Gradient Overlay:
            Keeps the left side dark for crystal-clear readability of the React hero text,
            while smoothly fading to transparent in the center so the smiling businesswoman and laptop remain 100% visible and bright! */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent w-full lg:w-[60%] pointer-events-none" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full shrink-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div className="text-xl sm:text-2xl text-white tracking-tight">
              <span className="font-extrabold">Job</span>
              <span className="font-semibold text-white/95">Portal</span>
            </div>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              to="/"
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/dashboard"
              className="text-white/90 text-sm font-medium hover:text-white transition-colors"
            >
              Companies
            </Link>
            <Link
              to="/login"
              className="text-white text-sm font-medium px-5 py-1.5 rounded-lg border border-white/80 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single Web Content: Perfectly fits within the screen height with zero scroll */}
      <main className="relative z-10 flex-1 min-h-0 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 my-auto">
        
        {/* Left Column: Hero Content & Checked Features */}
        <div className="w-full lg:max-w-lg text-left flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-white tracking-tight leading-[1.12]">
            Find Your <br />
            <span className="text-[#2563eb]">Dream</span> Job
          </h1>

          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed max-w-md">
            Explore thousands of job opportunities from top companies and take
            the next step in your career.
          </p>

          {/* Bullet points with blue circle and checkmark */}
          <div className="mt-4 space-y-2.5">
            {[
              'Verified Companies',
              'Easy Job Applications',
              'Build Your Profile',
              'Get Hired Faster',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1877f2] flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
                <span className="text-white text-sm sm:text-[15px] font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-white/15 grid grid-cols-3 max-w-sm gap-2">
            <div className="border-r border-white/20 pr-3">
              <div className="text-xl sm:text-2xl font-extrabold text-white">50K+</div>
              <div className="text-xs text-gray-300 mt-0.5">Jobs</div>
            </div>
            <div className="border-r border-white/20 px-2 sm:px-3">
              <div className="text-xl sm:text-2xl font-extrabold text-white">10K+</div>
              <div className="text-xs text-gray-300 mt-0.5">Companies</div>
            </div>
            <div className="pl-2 sm:pl-3">
              <div className="text-xl sm:text-2xl font-extrabold text-white">1M+</div>
              <div className="text-xs text-gray-300 mt-0.5">Job Seekers</div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Login Card (Compact proportions for single-screen fit) */}
        <div className="w-full lg:max-w-[390px] xl:max-w-[410px] flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 xl:p-7 shadow-2xl text-slate-800 border border-slate-100/90 transition-all">
            
            {/* Card Header */}
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 mb-3 sm:mb-4">
                Login to your account to continue
              </p>
            </div>

            {/* Role Selection Switcher */}
            <div className="mb-3 bg-slate-100 p-0.5 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedRole('Candidate')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'Candidate'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('Recruiter')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedRole === 'Recruiter'
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Recruiter</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3" noValidate>
              
              {/* Email Input */}
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-white transition-all ${
                    errors.email
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className="w-full py-2.5 sm:py-3 pr-3 pl-10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 text-left pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input with Show/Hide toggle */}
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-white transition-all ${
                    errors.password
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full py-2.5 sm:py-3 pl-10 pr-10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 focus:outline-none transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[11px] mt-1 text-left pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#1877f2] hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1877f2] hover:bg-[#1565d8] active:scale-[0.99] text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 rounded-xl transition duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Divider "or continue with" */}
            <div className="relative my-3 sm:my-3.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] text-slate-400">
                <span className="bg-white px-2.5">or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  demoLogin(selectedRole);
                  toast.success(`Signed in via Google as ${selectedRole}!`);
                  navigate(from, { replace: true });
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition text-xs font-medium text-slate-700 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  demoLogin(selectedRole);
                  toast.success(`Signed in via LinkedIn as ${selectedRole}!`);
                  navigate(from, { replace: true });
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition text-xs font-medium text-slate-700 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>

            {/* Bottom link: Don't have an account? Sign up */}
            <div className="mt-3.5 text-center text-xs text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#1877f2] font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>

            {/* Quick Fill Autofill Hint */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick Fill:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('Candidate')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded font-medium transition cursor-pointer"
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('Recruiter')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded font-medium transition cursor-pointer"
                >
                  Recruiter
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="relative z-20 py-2 sm:py-2.5 text-center text-[11px] text-white/50 border-t border-white/10 shrink-0">
        &copy; 2026 JobPortal. All rights reserved.
      </footer>
    </div>
  );
};
