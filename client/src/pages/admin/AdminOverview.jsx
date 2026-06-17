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
    { label: 'Active Doctors', value: stats?.counts?.doctors || 0, color: 'text-teal-600', sub: 'Homeopathy specialists' },
    { label: 'Registered Patients', value: stats?.counts?.patients || 0, color: 'text-blue-600', sub: 'Patient accounts' },
    { label: 'Total Appointments', value: stats?.counts?.appointments?.total || 0, color: 'text-indigo-600', sub: `${stats?.counts?.appointments?.pending || 0} pending` },
    { label: 'Callback Requests', value: stats?.counts?.consultations?.total || 0, color: 'text-amber-600', sub: `${stats?.counts?.consultations?.new || 0} new` },
    { label: 'Contact Messages', value: stats?.counts?.contacts?.total || 0, color: 'text-rose-600', sub: `${stats?.counts?.contacts?.unread || 0} unread` },
    { label: 'Treatments', value: stats?.counts?.treatments || 0, color: 'text-emerald-600', sub: 'Active treatments' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time clinic management insights</p>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => (
          <div key={w.label} className="bg-white border border-slate-200/60 rounded-xl p-5 hover:border-teal-350 shadow-sm transition-all duration-200">
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">{w.label}</span>
            <p className={`text-3xl font-black mt-1 ${w.color}`}>{w.value}</p>
            <span className="text-xs text-slate-500 font-semibold">{w.sub}</span>
          </div>
        ))}
      </div>

      {/* Appointment Status Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats?.counts?.appointments?.pending, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Confirmed', value: stats?.counts?.appointments?.confirmed, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Completed', value: stats?.counts?.appointments?.completed, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Cancelled', value: stats?.counts?.appointments?.cancelled, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border rounded-xl p-4 text-center shadow-xs`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value || 0}</p>
            <span className="text-xs text-slate-500 font-bold uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold border-b border-slate-100 pb-3 mb-4 text-slate-800">Recent Appointments</h3>
        {stats?.recentAppointments?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats.recentAppointments.map((app) => (
              <div key={app._id} className="py-3.5 flex justify-between items-center gap-4">
                <div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                    app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    app.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    app.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {app.status}
                  </span>
                  <h4 className="font-bold text-slate-800 mt-1.5">{app.patientName}</h4>
                  <span className="text-xs text-slate-500">
                    {formatDate(app.preferredDate)} • {app.preferredTime}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-600">{app.doctor?.name || 'Unassigned'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No recent appointments.</p>
        )}
      </div>
    </div>
  );
}
