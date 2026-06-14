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
      toast.success('Profile updated');
      if (refreshUser) refreshUser();
    } catch (error) { toast.error(error.message || 'Update failed'); } finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.updatePassword(pwForm);
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (error) { toast.error(error.message || 'Failed'); }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <h1 className="text-2xl font-extrabold">My Profile</h1>
      <form onSubmit={handleSubmit} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Personal Information</h3>
        {[{ key: 'name', label: 'Full Name' }, { key: 'phone', label: 'Phone' }, { key: 'address', label: 'Address' }].map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs text-slate-400 block mb-1">{label}</label>
            <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div>
          <label className="text-xs text-slate-400 block mb-1">Email</label>
          <input type="email" disabled className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-500 cursor-not-allowed" value={user?.email || ''} />
        </div>
        <button type="submit" disabled={saving} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
      <form onSubmit={handlePassword} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Change Password</h3>
        <div><label className="text-xs text-slate-400 block mb-1">Current Password</label><input type="password" required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} /></div>
        <div><label className="text-xs text-slate-400 block mb-1">New Password</label><input type="password" required minLength={6} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} /></div>
        <button type="submit" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold py-2 px-5 rounded-lg text-sm transition">Update Password</button>
      </form>
    </div>
  );
}
