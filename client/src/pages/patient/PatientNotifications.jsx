import React, { useState, useEffect } from 'react';
import { notificationService } from '../../api/services.js';
import Loader from '../../components/ui/Loader.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import toast from 'react-hot-toast';

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response?.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response?.success) {
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
        );
      }
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response?.success) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await notificationService.deleteNotification(id);
      if (response?.success) {
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        toast.success('Notification deleted');
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500">Stay informed about your clinic bookings and alerts.</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs bg-white hover:bg-slate-50 text-teal-700 hover:text-teal-800 py-1.5 px-3 rounded-lg border border-slate-200 font-semibold transition cursor-pointer"
          >
            ✓ Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader size="lg" /></div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              className={`border rounded-xl p-4 flex gap-4 items-start justify-between transition ${
                n.isRead
                  ? 'bg-white border-slate-200/60 opacity-80'
                  : 'bg-teal-50/40 border-teal-100/80 hover:bg-teal-50/70 cursor-pointer'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${n.isRead ? 'text-slate-600' : 'text-slate-800'}`}>
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block">{formatDate(n.createdAt)}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n._id);
                }}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg text-sm transition cursor-pointer"
                aria-label="Delete notification"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔔"
          title="All caught up!"
          description="You don't have any notifications at the moment."
        />
      )}
    </div>
  );
}
