import React, { useState, useEffect } from 'react';
import { userService } from '../../api/services.js';
import SearchInput from '../../components/ui/SearchInput.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    try {
      const response = await userService.getUsers({ role: 'patient', search: search || undefined, limit: 50 });
      if (response?.success) setPatients(response.data);
    } catch { toast.error('Failed to load patients'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchPatients(); }, [search]);

  const handleToggleActive = async (id) => {
    try {
      await userService.toggleActive(id);
      toast.success('Status updated');
      fetchPatients();
    } catch { toast.error('Update failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <TableSkeleton rows={6} cols={5} />;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Patient Records</h1>
          <p className="text-slate-400 text-sm mt-1">{patients.length} registered patients</p>
        </div>
        <div className="w-full md:w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patients..." />
        </div>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto bg-slate-900/30 border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 uppercase text-xs tracking-wider">
                <th className="p-4 font-bold">Patient</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {patients.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/20 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-300">
                        {p.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">{p.email}</td>
                  <td className="p-4 text-slate-400 font-mono">{p.phone || '—'}</td>
                  <td className="p-4 text-slate-400">{formatDate(p.createdAt)}</td>
                  <td className="p-4">
                    <StatusBadge status={p.isActive ? 'active' : 'inactive'} size="xs" />
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleToggleActive(p._id)}
                      className={`text-xs font-semibold py-1 px-3 rounded-lg border transition ${p.isActive ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'}`}>
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="👥" title="No patients found" description="No patient accounts match your search." />
      )}
    </div>
  );
}
