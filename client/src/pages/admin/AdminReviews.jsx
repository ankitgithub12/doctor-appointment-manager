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
    try { await reviewService.approveReview(id, isApproved); toast.success(isApproved ? 'Approved successfully!' : 'Review hidden'); fetchReviews(); } catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try { await reviewService.deleteReview(id); toast.success('Deleted successfully'); fetchReviews(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>;

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Moderate Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">Approve, reject, or hide reviews and success stories submitted by patients.</p>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-teal-350 shadow-sm transition-all duration-200">
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${rev.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                    {rev.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <span className="text-amber-500 text-sm font-bold">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                </div>
                <div className="flex gap-2.5 items-center pt-1">
                  <div className="w-9 h-9 bg-teal-55 border border-teal-100 text-teal-600 font-bold rounded-full flex items-center justify-center text-xs shadow-2xs">{rev.initials}</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{rev.patientName}</h4>
                    <span className="text-xs text-slate-500 block font-medium">Condition: {rev.condition}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm italic leading-relaxed pt-1">"{rev.text}"</p>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button onClick={() => handleApprove(rev._id, !rev.isApproved)}
                  className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition cursor-pointer ${
                    rev.isApproved 
                      ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600' 
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                  }`}>
                  {rev.isApproved ? 'Hide' : 'Approve'}
                </button>
                <button onClick={() => handleDelete(rev._id)} className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer">Delete</button>
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
