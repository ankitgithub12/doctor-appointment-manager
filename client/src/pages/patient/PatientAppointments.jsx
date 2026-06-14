import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../api/services.js';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ConfirmDialog from '../../components/ui/ConfirmDialog.jsx';
import toast from 'react-hot-toast';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [appToCancel, setAppToCancel] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getMyAppointments();
      if (response?.success) {
        setAppointments(response.data || []);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...appointments];

    if (statusFilter !== 'all') {
      result = result.filter((app) => app.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          (app.doctor?.name && app.doctor.name.toLowerCase().includes(query)) ||
          (app.healthConcern && app.healthConcern.toLowerCase().includes(query))
      );
    }

    setFilteredAppointments(result);
  }, [appointments, statusFilter, searchTerm]);

  const handleCancelClick = (app, e) => {
    e.stopPropagation();
    setAppToCancel(app);
    setIsCancelOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appToCancel) return;
    try {
      const response = await appointmentService.updateStatus(appToCancel._id, { status: 'cancelled' });
      if (response?.success) {
        toast.success('Appointment cancelled successfully');
        // Refresh local items
        setAppointments((prev) =>
          prev.map((app) => (app._id === appToCancel._id ? { ...app, status: 'cancelled' } : app))
        );
      } else {
        toast.error(response?.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      toast.error(error.message || 'Error occurred');
    } finally {
      setIsCancelOpen(false);
      setAppToCancel(null);
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">My Consultations</h1>
          <p className="text-sm text-slate-400">Track and manage your homeopathic session history.</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/10 border border-slate-800/80 rounded-xl p-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by specialist or concern..."
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content list */}
      {loading ? (
        <div className="py-20"><Loader size="lg" /></div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((app) => (
            <div
              key={app._id}
              onClick={() => handleViewDetails(app)}
              className="bg-slate-900/30 border border-slate-850 hover:border-slate-750/80 rounded-xl p-5 transition cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-200 text-base">
                      {app.doctor?.name || 'Homeopathy Specialist'}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {app.doctor?.specializations?.join(', ') || 'Homeopath'}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="text-xs text-slate-400 space-y-1 bg-slate-950/45 p-2.5 rounded-lg border border-slate-900">
                  <p>📅 <span className="font-medium text-slate-300">{formatDate(app.preferredDate)}</span></p>
                  <p>⏰ <span className="font-medium text-slate-300">Slot: {app.preferredTime}</span></p>
                </div>

                <div>
                  <h4 className="text-xs text-slate-500 font-bold uppercase tracking-wide">Concern:</h4>
                  <p className="text-sm text-slate-300 mt-1 italic line-clamp-2">
                    "{app.healthConcern}"
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(app);
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  View Full Details
                </button>

                {app.status === 'pending' && (
                  <button
                    onClick={(e) => handleCancelClick(app, e)}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📅"
          title="No consultations found"
          description={
            statusFilter === 'all'
              ? "You haven't scheduled any consultations yet."
              : `No consultations found matching status "${statusFilter}".`
          }
        />
      )}

      {/* Appointment Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Consultation Details">
        {selectedApp && (
          <div className="space-y-5">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-200">{selectedApp.doctor?.name || 'Homeopathy Specialist'}</h3>
                <p className="text-sm text-slate-400">{selectedApp.doctor?.specializations?.join(', ') || 'Specialist'}</p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850">
                <span className="text-xs text-slate-500 block uppercase font-bold">Preferred Date</span>
                <span className="text-slate-200 font-medium">{formatDate(selectedApp.preferredDate)}</span>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-850">
                <span className="text-xs text-slate-500 block uppercase font-bold">Scheduled Time Slot</span>
                <span className="text-slate-200 font-medium">{selectedApp.preferredTime}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block uppercase font-bold">Health Concerns & History</span>
              <div className="mt-1 bg-slate-950/40 p-4 rounded-lg border border-slate-850 text-slate-300 text-sm whitespace-pre-line italic">
                "{selectedApp.healthConcern}"
              </div>
            </div>

            {selectedApp.notes && (
              <div>
                <span className="text-xs text-emerald-400 block uppercase font-bold">Doctor Notes & Recommendation</span>
                <div className="mt-1 bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10 text-slate-350 text-sm whitespace-pre-line">
                  {selectedApp.notes}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isCancelOpen}
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this consultation? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={confirmCancelAppointment}
        onCancel={() => {
          setIsCancelOpen(false);
          setAppToCancel(null);
        }}
        variant="danger"
      />
    </div>
  );
}
