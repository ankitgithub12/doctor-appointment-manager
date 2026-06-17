import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../api/services.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
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
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await appointmentService.deleteAppointment(id);
      toast.success('Appointment deleted');
      fetchAppointments();
    } catch { toast.error('Delete failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">{appointments.length} total appointments</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition cursor-pointer ${
                statusFilter === s 
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                  : 'border-slate-200 bg-white text-slate-500 hover:text-teal-600 hover:bg-slate-50'
              }`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div key={app._id} className="bg-white border border-slate-200/60 rounded-xl p-5 flex flex-col lg:flex-row gap-5 justify-between items-start hover:border-teal-350 shadow-sm transition-all duration-200">
              <div className="space-y-3 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={app.status} />
                  <span className="text-slate-700 text-sm font-bold">{formatDate(app.preferredDate)}</span>
                  <span className="text-slate-350">•</span>
                  <span className="text-slate-700 text-sm font-semibold">Slot: {app.preferredTime}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Patient Details</label>
                    <span className="text-slate-800 font-bold text-sm">{app.patientName} ({app.phone})</span>
                    <span className="block text-xs text-slate-500 font-semibold">{app.email}</span>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Assigned Doctor</label>
                    <span className="text-slate-800 font-bold text-sm">{app.doctor?.name || 'Unassigned'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Health Concern</label>
                  <p className="text-slate-600 text-sm italic mt-0.5">"{app.healthConcern}"</p>
                </div>
                <div className="flex gap-2 items-center pt-2">
                  <input type="text" placeholder="Add custom notes..." className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-500 flex-1"
                    value={notesText[app._id] !== undefined ? notesText[app._id] : app.notes || ''}
                    onChange={(e) => setNotesText({ ...notesText, [app._id]: e.target.value })} />
                  <button onClick={() => handleUpdateStatus(app._id, app.status)} className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-1.5 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer">Save Note</button>
                </div>
              </div>
              
              <div className="flex lg:flex-col gap-2 w-full lg:w-auto lg:border-l lg:border-slate-100 lg:pl-5 pt-2 lg:pt-0">
                {['confirmed', 'completed', 'cancelled'].map((s) => (
                  <button key={s} onClick={() => handleUpdateStatus(app._id, s)} disabled={app.status === s}
                    className={`flex-1 lg:w-32 text-xs font-bold py-2 px-3 rounded-lg border transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
                      s === 'confirmed' ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700' :
                      s === 'completed' ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700' :
                      'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                    }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                <button onClick={() => handleDelete(app._id)} className="flex-1 lg:w-32 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer">Delete</button>
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
