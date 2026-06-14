import React, { useState, useEffect } from 'react';
import { reviewService } from '../../api/services.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { CardSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try { const r = await reviewService.getAllReviews(); if (r?.success) setReviews(r.data); } catch { toast.error('Failed to load reviews'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id, isApproved) => {
    try { await reviewService.approveReview(id, isApproved); toast.success(isApproved ? 'Approved!' : 'Hidden'); fetchReviews(); } catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try { await reviewService.deleteReview(id); toast.success('Deleted'); fetchReviews(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">Moderate Reviews</h1>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded border font-semibold uppercase ${rev.isApproved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {rev.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <span className="text-amber-500 text-sm font-bold">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <div className="w-9 h-9 bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-full flex items-center justify-center text-xs">{rev.initials}</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{rev.patientName}</h4>
                    <span className="text-xs text-slate-500 block">Condition: {rev.condition}</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">"{rev.text}"</p>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800/80">
                <button onClick={() => handleApprove(rev._id, !rev.isApproved)}
                  className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition ${rev.isApproved ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'}`}>
                  {rev.isApproved ? 'Hide' : 'Approve'}
                </button>
                <button onClick={() => handleDelete(rev._id)} className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold py-1.5 px-3 rounded-lg transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="⭐" title="No reviews" description="No patient reviews submitted yet." />
      )}
    </div>
  );
}
