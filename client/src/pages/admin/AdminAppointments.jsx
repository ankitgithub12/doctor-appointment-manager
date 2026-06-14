import React, { useState, useEffect } from 'react';
import { appointmentService, statsService } from '../../api/services.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [notesText, setNotesText] = useState({});

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments({ status: statusFilter || undefined });
      if (response?.success) setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const notes = notesText[id] || '';
      await appointmentService.updateStatus(id, { status, notes });
      toast.success(`Status updated to ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await appointmentService.deleteAppointment(id);
      toast.success('Appointment deleted');
      fetchAppointments();
    } catch { toast.error('Delete failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Manage Appointments</h1>
          <p className="text-slate-400 text-sm mt-1">{appointments.length} total appointments</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${statusFilter === s ? 'bg-teal-500 text-slate-950 border-teal-500' : 'border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div key={app._id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row gap-5 justify-between items-start hover:border-slate-700/50 transition-all">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={app.status} />
                  <span className="text-slate-300 text-sm font-semibold">{formatDate(app.preferredDate)}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 text-sm">Slot: {app.preferredTime}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block uppercase font-bold">Patient</label>
                    <span className="text-slate-200 font-semibold text-sm">{app.patientName} ({app.phone})</span>
                    <span className="block text-xs text-slate-400">{app.email}</span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block uppercase font-bold">Doctor</label>
                    <span className="text-slate-200 font-semibold text-sm">{app.doctor?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block uppercase font-bold">Concern</label>
                  <p className="text-slate-300 text-sm italic">"{app.healthConcern}"</p>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Add notes..." className="bg-slate-950/80 border border-slate-800 rounded-lg py-1.5 px-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 flex-1"
                    value={notesText[app._id] !== undefined ? notesText[app._id] : app.notes || ''}
                    onChange={(e) => setNotesText({ ...notesText, [app._id]: e.target.value })} />
                  <button onClick={() => handleUpdateStatus(app._id, app.status)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-700 transition">Save</button>
                </div>
              </div>
              <div className="flex lg:flex-col gap-2 w-full lg:w-auto lg:border-l lg:border-slate-800/80 lg:pl-5">
                {['confirmed', 'completed', 'cancelled'].map((s) => (
                  <button key={s} onClick={() => handleUpdateStatus(app._id, s)} disabled={app.status === s}
                    className={`flex-1 lg:w-32 text-xs font-bold py-2 px-3 rounded-lg border transition disabled:opacity-30 disabled:pointer-events-none ${
                      s === 'confirmed' ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400' :
                      s === 'completed' ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400' :
                      'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
                    }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                <button onClick={() => handleDelete(app._id)} className="flex-1 lg:w-32 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700 text-slate-400 text-xs font-bold py-2 px-3 rounded-lg transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📅" title="No appointments found" description="No appointments match the current filter." />
      )}
    </div>
  );
}
