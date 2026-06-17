import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services.js';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setSubmitting(true);
    try {
      const response = await authService.resetPassword(token, password);
      if (response?.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(response?.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.message || 'Reset link may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 relative flex items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-teal-600 text-xs font-bold uppercase tracking-wider">Security Desk</span>
            <h1 className="text-2xl font-extrabold">Reset Password</h1>
            <p className="text-sm text-slate-500">
              {success
                ? "Your credentials are updated."
                : "Create a new strong password for your account."}
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-250/50 rounded-xl p-4 text-center">
                <span className="text-3xl">🔑</span>
                <p className="text-slate-600 text-xs mt-3 leading-relaxed">
                  Your password has been updated. You can now use your new password to access your account.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-teal-500/15 block transition"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-3 text-sm text-slate-755 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-3 text-sm text-slate-755 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-teal-500/15 transition disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
