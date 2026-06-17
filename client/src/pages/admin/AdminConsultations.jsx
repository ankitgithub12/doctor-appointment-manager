import React, { useState, useEffect } from 'react';
import { consultationService } from '../../api/services.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try { const r = await consultationService.getConsultations(); if (r?.success) setConsultations(r.data); } catch { toast.error('Failed'); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleUpdate = async (id, status) => {
    try { await consultationService.updateStatus(id, status); toast.success(`Set to ${status}`); fetch(); } catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this callback request?')) return;
    try { await consultationService.deleteConsultation(id); toast.success('Deleted successfully'); fetch(); } catch { toast.error('Failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Callback Requests</h1>
        <p className="text-sm text-slate-500 mt-1">Manage dynamic callback submissions from the home page booking and inquiry sections.</p>
      </div>

      {consultations.length > 0 ? (
        <div className="overflow-x-auto bg-white border border-slate-200/60 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">Patient</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Concern</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consultations.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-bold text-slate-800">{c.name}</td>
                  <td className="p-4 text-slate-655 font-mono font-medium">{c.phone}</td>
                  <td className="p-4 text-slate-500 italic max-w-xs truncate font-medium">"{c.healthConcern}"</td>
                  <td className="p-4 text-slate-500 font-medium">{formatDate(c.createdAt)}</td>
                  <td className="p-4"><StatusBadge status={c.status} size="xs" /></td>
                  <td className="p-4 text-right flex gap-1.5 justify-end items-center">
                    <button onClick={() => handleUpdate(c._id, 'contacted')} disabled={c.status === 'contacted'} className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold py-1.5 px-2.5 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer">Contacted</button>
                    <button onClick={() => handleUpdate(c._id, 'closed')} disabled={c.status === 'closed'} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold py-1.5 px-2.5 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer">Close</button>
                    <button onClick={() => handleDelete(c._id)} className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 text-xs font-bold py-1.5 px-2.5 rounded-lg transition cursor-pointer">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="📞" title="No callbacks" description="No callback requests logged." />
      )}
    </div>
  );
}
