import React, { useState } from 'react';
import { authService } from '../api/services.js';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response?.success) {
        setSent(true);
        toast.success('Reset email sent successfully!');
      } else {
        toast.error(response?.message || 'Failed to request password reset');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-32 pb-20 relative flex items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-wider">Security Desk</span>
            <h1 className="text-2xl font-extrabold">Forgot Password</h1>
            <p className="text-sm text-slate-400">
              {sent
                ? "Check your inbox for a recovery link."
                : "Enter your email address and we'll send you a recovery link."}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
                <span className="text-3xl">✉️</span>
                <p className="text-slate-350 text-xs mt-3 leading-relaxed">
                  We've dispatched password recovery instructions to <span className="font-semibold text-slate-200">{email}</span>. Please verify your spam/junk folder if you don't receive it shortly.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-lg text-sm font-semibold border border-slate-700 block transition"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-3 rounded-lg text-sm font-bold shadow-lg shadow-teal-500/10 transition disabled:opacity-50"
              >
                {submitting ? 'Sending Link...' : 'Send Recovery Link'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
