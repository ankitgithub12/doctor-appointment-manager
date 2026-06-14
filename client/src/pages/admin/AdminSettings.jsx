import React from 'react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">System Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">Clinic Information</h3>
          <div className="space-y-3">
            {[
              { label: 'Clinic Name', value: 'HomeHub Homeopathy' },
              { label: 'Phone', value: '+91 98295 93852' },
              { label: 'Email', value: 'info@homehubhomeopathy.com' },
              { label: 'Address', value: '102, Apex Mall, Lalkothi, Jaipur, Rajasthan 302015' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 block uppercase font-bold">{label}</label>
                <p className="text-slate-300 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'API Version', value: '2.0.0', status: '🟢' },
              { label: 'Database', value: 'MongoDB Atlas', status: '🟢' },
              { label: 'Media Storage', value: 'Cloudinary', status: '🟢' },
              { label: 'Email Service', value: 'Configured', status: '🟡' },
            ].map(({ label, value, status }) => (
              <div key={label} className="flex justify-between items-center">
                <div>
                  <label className="text-xs text-slate-500 block uppercase font-bold">{label}</label>
                  <p className="text-slate-300 text-sm">{value}</p>
                </div>
                <span className="text-lg">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
