import React, { useState, useEffect } from 'react';
import { statsService } from '../../api/services.js';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getDashboardStats();
        if (response?.success) setStats(response.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="space-y-6"><TableSkeleton rows={3} cols={4} /><TableSkeleton rows={3} cols={4} /></div>;

  const widgets = [
    { label: 'Active Doctors', value: stats?.counts?.doctors || 0, color: 'text-teal-400', sub: 'Homeopathy specialists' },
    { label: 'Registered Patients', value: stats?.counts?.patients || 0, color: 'text-blue-400', sub: 'Patient accounts' },
    { label: 'Total Appointments', value: stats?.counts?.appointments?.total || 0, color: 'text-indigo-400', sub: `${stats?.counts?.appointments?.pending || 0} pending` },
    { label: 'Callback Requests', value: stats?.counts?.consultations?.total || 0, color: 'text-amber-400', sub: `${stats?.counts?.consultations?.new || 0} new` },
    { label: 'Contact Messages', value: stats?.counts?.contacts?.total || 0, color: 'text-rose-400', sub: `${stats?.counts?.contacts?.unread || 0} unread` },
    { label: 'Treatments', value: stats?.counts?.treatments || 0, color: 'text-emerald-400', sub: 'Active treatments' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time clinic management insights</p>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => (
          <div key={w.label} className="bg-slate-900/35 border border-slate-800 rounded-xl p-5 hover:border-slate-700/50 transition-all duration-200">
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{w.label}</span>
            <p className={`text-3xl font-black mt-1 ${w.color}`}>{w.value}</p>
            <span className="text-xs text-slate-400">{w.sub}</span>
          </div>
        ))}
      </div>

      {/* Appointment Status Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats?.counts?.appointments?.pending, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/10' },
          { label: 'Confirmed', value: stats?.counts?.appointments?.confirmed, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10' },
          { label: 'Completed', value: stats?.counts?.appointments?.completed, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10' },
          { label: 'Cancelled', value: stats?.counts?.appointments?.cancelled, color: 'text-rose-400', bg: 'bg-rose-500/5 border-rose-500/10' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value || 0}</p>
            <span className="text-xs text-slate-400 font-semibold uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-6">
        <h3 className="text-lg font-bold border-b border-slate-800 pb-3 mb-4">Recent Appointments</h3>
        {stats?.recentAppointments?.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {stats.recentAppointments.map((app) => (
              <div key={app._id} className="py-3.5 flex justify-between items-center gap-4">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold uppercase ${
                    app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    app.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    app.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {app.status}
                  </span>
                  <h4 className="font-semibold text-slate-200 mt-1.5">{app.patientName}</h4>
                  <span className="text-xs text-slate-400">
                    {formatDate(app.preferredDate)} • {app.preferredTime}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-300">{app.doctor?.name || 'Unassigned'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-8">No recent appointments.</p>
        )}
      </div>
    </div>
  );
}
