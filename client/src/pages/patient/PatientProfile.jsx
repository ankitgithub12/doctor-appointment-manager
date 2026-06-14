import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../api/services.js';
import toast from 'react-hot-toast';

export default function PatientProfile() {
  const { user, refreshUser } = useAuth();
  
  // Profile form state
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    emergencyContact: user?.emergencyContact || '',
  });

  // Avatar file state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        emergencyContact: user.emergencyContact || '',
      });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      // Append all textual fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Append avatar if chosen
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await authService.updateProfile(formData);
      if (response?.success) {
        toast.success('Profile updated successfully');
        if (refreshUser) await refreshUser();
      } else {
        toast.error(response?.message || 'Update failed');
      }
    } catch (error) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      const response = await authService.updatePassword(pwForm);
      if (response?.success) {
        toast.success('Password changed successfully');
        setPwForm({ currentPassword: '', newPassword: '' });
      } else {
        toast.error(response?.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">My Profile</h1>
        <p className="text-sm text-slate-400">View and update your personal info and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar & Account Metadata */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2 text-left">Profile Picture</h3>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-500/30 bg-slate-950 flex items-center justify-center relative group">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-slate-600">👤</span>
              )}
            </div>
            
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs px-3 py-1.5 rounded-lg border border-slate-700/80 transition font-semibold">
              Choose Image
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <p className="text-2xs text-slate-500">Supports PNG, JPG, GIF up to 5MB</p>
          </div>

          <div className="text-left pt-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
            <p className="flex justify-between">
              <span>Account Role:</span>
              <span className="font-semibold text-emerald-400 uppercase">{user?.role}</span>
            </p>
            <p className="flex justify-between">
              <span>Registered Email:</span>
              <span className="text-slate-350 truncate max-w-[150px]">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Right Column: Detail Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details Form */}
          <form onSubmit={handleProfileSubmit} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Gender</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Blood Group</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={form.emergencyContact}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Residential Address</label>
              <textarea
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-6 rounded-lg text-sm transition disabled:opacity-50"
              >
                {saving ? 'Saving Profile...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordSubmit} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Security & Credentials</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPw}
                className="bg-slate-800 hover:bg-slate-755 border border-slate-700 text-slate-250 font-bold py-2 px-5 rounded-lg text-sm transition"
              >
                {changingPw ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
