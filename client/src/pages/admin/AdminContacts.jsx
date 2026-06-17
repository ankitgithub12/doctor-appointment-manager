import React, { useState, useEffect } from 'react';
import { contactService } from '../../api/services.js';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { CardSkeleton } from '../../components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try { const r = await contactService.getContacts(); if (r?.success) setContacts(r.data); } catch { toast.error('Failed'); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleToggleRead = async (id, isRead) => {
    try { await contactService.markAsRead(id, isRead); toast.success(isRead ? 'Marked as read' : 'Marked as unread'); fetch(); } catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try { await contactService.deleteContact(id); toast.success('Deleted successfully'); fetch(); } catch { toast.error('Failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>;

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Contact Inbox</h1>
        <p className="text-sm text-slate-500 mt-1">Review dynamic messages submitted from the contact page forms.</p>
      </div>

      {contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c._id} className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-3 hover:border-teal-350 shadow-sm transition-all duration-200">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${c.isRead ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    {c.isRead ? 'Read' : 'New'}
                  </span>
                  <h4 className="font-bold text-slate-800 mt-2.5 text-sm">{c.subject}</h4>
                  <span className="text-xs text-slate-500 font-semibold block mt-0.5">From: {c.name} ({c.email}) {c.phone && `• ${c.phone}`}</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-medium italic">"{c.message}"</p>
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => handleToggleRead(c._id, !c.isRead)} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-655 text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer">
                  {c.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button onClick={() => handleDelete(c._id)} className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="✉️" title="No messages" description="Your inbox is empty." />
      )}
    </div>
  );
}
