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
    if (!window.confirm('Delete?')) return;
    try { await consultationService.deleteConsultation(id); toast.success('Deleted'); fetch(); } catch { toast.error('Failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">Callback Requests</h1>
      {consultations.length > 0 ? (
        <div className="overflow-x-auto bg-slate-900/30 border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 uppercase text-xs tracking-wider">
                <th className="p-4 font-bold">Patient</th><th className="p-4 font-bold">Phone</th><th className="p-4 font-bold">Concern</th>
                <th className="p-4 font-bold">Date</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {consultations.map((c) => (
                <tr key={c._id} className="hover:bg-slate-800/20 transition">
                  <td className="p-4 font-semibold text-slate-200">{c.name}</td>
                  <td className="p-4 text-slate-300 font-mono">{c.phone}</td>
                  <td className="p-4 text-slate-400 italic max-w-xs truncate">"{c.healthConcern}"</td>
                  <td className="p-4 text-slate-400">{formatDate(c.createdAt)}</td>
                  <td className="p-4"><StatusBadge status={c.status} size="xs" /></td>
                  <td className="p-4 text-right flex gap-1.5 justify-end">
                    <button onClick={() => handleUpdate(c._id, 'contacted')} disabled={c.status === 'contacted'} className="bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-400 text-xs font-semibold py-1 px-2.5 rounded transition disabled:opacity-30">Contacted</button>
                    <button onClick={() => handleUpdate(c._id, 'closed')} disabled={c.status === 'closed'} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold py-1 px-2.5 rounded transition disabled:opacity-30">Close</button>
                    <button onClick={() => handleDelete(c._id)} className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold py-1 px-2.5 rounded transition">Delete</button>
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
