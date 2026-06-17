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
      toast.success('Status updated successfully');
      fetchPatients();
    } catch { toast.error('Update failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <TableSkeleton rows={6} cols={5} />;

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Patient Records</h1>
          <p className="text-slate-500 text-sm mt-1">{patients.length} registered patients</p>
        </div>
        <div className="w-full md:w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Search patients..." />
        </div>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto bg-white border border-slate-200/60 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-4">Patient</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-600 shadow-2xs">
                        {p.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.email}</td>
                  <td className="p-4 text-slate-600 font-mono font-medium">{p.phone || '—'}</td>
                  <td className="p-4 text-slate-500 font-medium">{formatDate(p.createdAt)}</td>
                  <td className="p-4">
                    <StatusBadge status={p.isActive ? 'active' : 'inactive'} size="xs" />
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleToggleActive(p._id)}
                      className={`text-xs font-bold py-1 px-3 rounded-lg border transition cursor-pointer ${
                        p.isActive 
                          ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600' 
                          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                      }`}>
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
