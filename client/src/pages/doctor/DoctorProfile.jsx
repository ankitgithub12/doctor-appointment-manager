import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../api/services.js';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(form);
      toast.success('Profile updated successfully');
      if (refreshUser) refreshUser();
    } catch (error) { 
      toast.error(error.message || 'Update failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.updatePassword(pwForm);
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (error) { 
      toast.error(error.message || 'Failed to update password'); 
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">Manage your clinical personal details and account security.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2.5">Personal Information</h3>
        {[{ key: 'name', label: 'Full Name' }, { key: 'phone', label: 'Phone Number' }, { key: 'address', label: 'Address / Clinic Location' }].map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs text-slate-500 font-bold block mb-1">{label}</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500" 
              value={form[key]} 
              onChange={(e) => setForm({ ...form, [key]: e.target.value })} 
            />
          </div>
        ))}
        <div>
          <label className="text-xs text-slate-500 font-bold block mb-1">Email Address</label>
          <input 
            type="email" 
            disabled 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-400 cursor-not-allowed" 
            value={user?.email || ''} 
          />
        </div>
        <button 
          type="submit" 
          disabled={saving} 
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>

      <form onSubmit={handlePassword} className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2.5">Change Password</h3>
        <div>
          <label className="text-xs text-slate-500 font-bold block mb-1">Current Password</label>
          <input 
            type="password" 
            required 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500" 
            value={pwForm.currentPassword} 
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} 
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-bold block mb-1">New Password</label>
          <input 
            type="password" 
            required 
            minLength={6} 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500" 
            value={pwForm.newPassword} 
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} 
          />
        </div>
        <button 
          type="submit" 
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold py-2.5 px-5 rounded-lg text-sm transition cursor-pointer"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
