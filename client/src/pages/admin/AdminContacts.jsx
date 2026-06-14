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
    try { await contactService.markAsRead(id, isRead); toast.success(isRead ? 'Marked read' : 'Marked unread'); fetch(); } catch { toast.error('Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await contactService.deleteContact(id); toast.success('Deleted'); fetch(); } catch { toast.error('Failed'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <CardSkeleton key={i} />)}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">Contact Inbox</h1>
      {contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c._id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold uppercase ${c.isRead ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {c.isRead ? 'Read' : 'New'}
                  </span>
                  <h4 className="font-bold text-slate-200 mt-2 text-sm">{c.subject}</h4>
                  <span className="text-xs text-slate-400">From: {c.name} ({c.email}) {c.phone && `• ${c.phone}`}</span>
                </div>
                <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-slate-300 text-sm bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 leading-relaxed">{c.message}</p>
              <div className="flex gap-2 justify-end pt-1">
                <button onClick={() => handleToggleRead(c._id, !c.isRead)} className="bg-slate-800 hover:bg-slate-700 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold py-1.5 px-3 rounded transition">
                  {c.isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button onClick={() => handleDelete(c._id)} className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold py-1.5 px-3 rounded transition">Delete</button>
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
