import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      if (res.success) {
        setIsSubmitted(true);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickResetDemo = async () => {
    const res = await resetPassword(submittedEmail, 'newpassword123');
    if (res.success) {
      toast.success('Demo Password updated to: "newpassword123". You can now login!');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 font-sans select-none overflow-x-hidden">
      {/* Background with Ambient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80"
          alt="Office background"
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
          <Link to="/login" className="text-white/90 text-sm font-medium hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 border border-slate-100 text-left">
          
          {!isSubmitted ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <KeyRound className="w-6 h-6 stroke-[2]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Forgot Password?
              </h2>
              <p className="text-slate-500 text-sm mt-2 mb-6">
                No worries! Enter the email associated with your account and we will send you verification instructions.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                      placeholder="Enter registered email"
                      {...register('email', {
                        required: 'Please enter your email',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      className="w-full py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent rounded-xl"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 pl-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1877f2] hover:bg-[#1565d8] active:scale-[0.99] text-white font-semibold text-base py-3.5 rounded-xl transition duration-200 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending instructions...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Check Your Email</h2>
              <p className="text-slate-600 text-sm mt-2">
                We've sent password reset instructions to: <br />
                <span className="font-semibold text-slate-800">{submittedEmail}</span>
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Testing Option (Instant Password Reset):
                </div>
                <p>
                  Click below to immediately reset this account's password to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">newpassword123</code>.
                </p>
                <button
                  type="button"
                  onClick={handleQuickResetDemo}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Set Password to "newpassword123"
                </button>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-600">
            Remember your credentials?{' '}
            <Link to="/login" className="text-[#1877f2] font-semibold hover:underline">
              Sign in
            </Link>
          </div>

        </div>
      </main>

      <footer className="relative z-10 py-5 text-center text-xs text-white/50 border-t border-white/10">
        &copy; 2026 JobPortal System. All rights reserved.
      </footer>
    </div>
  );
};
