import React from 'react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor system parameters, clinic configurations, and server connectivity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Clinic Information</h3>
          <div className="space-y-3">
            {[
              { label: 'Clinic Name', value: 'HomeHub Homeopathy' },
              { label: 'Primary Contact', value: '+91 98295 93852' },
              { label: 'Support Email', value: 'info@homehubhomeopathy.com' },
              { label: 'Main Office Address', value: '102, Apex Mall, Lalkothi, Jaipur, Rajasthan 302015' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">{label}</label>
                <p className="text-slate-700 text-sm font-semibold mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'API Version', value: '2.0.0', status: '🟢 Connected' },
              { label: 'Database Service', value: 'MongoDB Atlas', status: '🟢 Connected' },
              { label: 'Media Storage Partner', value: 'Cloudinary', status: '🟢 Connected' },
              { label: 'Email Service Delivery', value: 'Configured', status: '🟢 Healthy' },
            ].map(({ label, value, status }) => (
              <div key={label} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                <div>
                  <label className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">{label}</label>
                  <p className="text-slate-700 text-sm font-semibold mt-0.5">{value}</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 py-1 px-2.5 rounded-lg">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
