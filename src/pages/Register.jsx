import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('Candidate'); // 'Candidate' or 'Recruiter'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
      terms: true,
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
        company: role === 'Recruiter' ? data.company || 'Enterprise Partner' : '',
      });

      if (res.success) {
        toast.success(`Account created successfully! Welcome to JobPortal, ${res.user.name}.`);
        navigate('/dashboard');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 font-sans select-none overflow-x-hidden">
      {/* Background with Dark Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern collaborative workspace"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/85 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-7 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div className="text-2xl text-white tracking-tight">
              <span className="font-extrabold">Job</span>
              <span className="font-semibold text-white/95">Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-7 sm:gap-9">
            <Link to="/" className="text-white/90 text-sm font-medium hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/login" className="text-white text-sm font-medium px-6 py-2 rounded-lg border border-white/80 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Register Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-14 py-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Value Proposition & Roles */}
        <div className="w-full lg:max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-4 border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Fast & Free Registration
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Start Your Journey with <br />
            <span className="text-[#2563eb]">JobPortal</span> Today
          </h1>

          <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg">
            Create an account to browse thousands of verified opportunities or post jobs to hire top talent worldwide.
          </p>

          {/* Interactive Role Selector Cards */}
          <div className="mt-8 space-y-3 max-w-lg">
            <div className="text-xs uppercase tracking-wider font-semibold text-gray-400">
              Select Your Role:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Candidate Option */}
              <div
                onClick={() => setRole('Candidate')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  role === 'Candidate'
                    ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-white/5 border-white/15 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  {role === 'Candidate' && (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div className="text-white font-bold text-base">Candidate</div>
                <div className="text-gray-300 text-xs mt-1">
                  Search, save and apply for verified jobs worldwide.
                </div>
              </div>

              {/* Recruiter Option */}
              <div
                onClick={() => setRole('Recruiter')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  role === 'Recruiter'
                    ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                    : 'bg-white/5 border-white/15 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {role === 'Recruiter' && (
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div className="text-white font-bold text-base">Recruiter</div>
                <div className="text-gray-300 text-xs mt-1">
                  Post openings, track candidates, and scale your team.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Register Card */}
        <div className="w-full lg:max-w-[460px]">
          <div className="w-full bg-white rounded-3xl p-7 sm:p-9 shadow-2xl text-slate-800 border border-slate-100">
            <div className="text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Create Account
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Register as a <span className="font-semibold text-blue-600">{role}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
              {/* Full Name */}
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-white ${
                    errors.name
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <User className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...register('name', { required: 'Please enter your full name' })}
                    className="w-full py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-white ${
                    errors.email
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <Mail className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Enter a valid email address',
                      },
                    })}
                    className="w-full py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Optional Company Name if Recruiter */}
              {role === 'Recruiter' && (
                <div>
                  <div className="relative flex items-center rounded-xl border border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                    <Building2 className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Company Name (e.g. Stripe, TechNova)"
                      {...register('company')}
                      className="w-full py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-white ${
                    errors.password
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create Password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div
                  className={`relative flex items-center rounded-xl border bg-white ${
                    errors.confirmPassword
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100'
                  }`}
                >
                  <Lock className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === passwordVal || 'Passwords do not match',
                    })}
                    className="w-full py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 text-left pl-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1 text-left">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    {...register('terms', { required: 'You must agree to continue' })}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <span>
                    I agree to the <span className="text-blue-600 font-medium hover:underline">Terms of Service</span> and <span className="text-blue-600 font-medium hover:underline">Privacy Policy</span>.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1 pl-6">{errors.terms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1877f2] hover:bg-[#1565d8] active:scale-[0.99] text-white font-semibold text-base py-3.5 rounded-xl transition duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as {role}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#1877f2] font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-5 text-center text-xs text-white/50 border-t border-white/10">
        &copy; 2026 JobPortal System. All rights reserved.
      </footer>
    </div>
  );
};
