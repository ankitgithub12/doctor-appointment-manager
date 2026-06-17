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
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Consultations</h1>
          <p className="text-sm text-slate-500">Track and manage your homeopathic session history.</p>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by specialist or concern..."
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-teal-600 hover:bg-slate-100'
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
              className="bg-white border border-slate-200/60 hover:border-teal-400/50 hover:shadow rounded-xl p-5 transition cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {app.doctor?.name || 'Homeopathy Specialist'}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {app.doctor?.specializations?.join(', ') || 'Homeopath'}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p>📅 <span className="font-semibold text-slate-700">{formatDate(app.preferredDate)}</span></p>
                  <p>⏰ <span className="font-semibold text-slate-700">Slot: {app.preferredTime}</span></p>
                </div>

                <div>
                  <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wide">Concern:</h4>
                  <p className="text-sm text-slate-600 mt-1 italic line-clamp-2">
                    "{app.healthConcern}"
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(app);
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                >
                  View Full Details
                </button>

                {app.status === 'pending' && (
                  <button
                    onClick={(e) => handleCancelClick(app, e)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded cursor-pointer"
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
          <div className="space-y-5 text-slate-800">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedApp.doctor?.name || 'Homeopathy Specialist'}</h3>
                <p className="text-sm text-slate-500">{selectedApp.doctor?.specializations?.join(', ') || 'Specialist'}</p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-400 block uppercase font-bold">Preferred Date</span>
                <span className="text-slate-700 font-semibold">{formatDate(selectedApp.preferredDate)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-400 block uppercase font-bold">Scheduled Time Slot</span>
                <span className="text-slate-700 font-semibold">{selectedApp.preferredTime}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block uppercase font-bold">Health Concerns & History</span>
              <div className="mt-1 bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-600 text-sm whitespace-pre-line italic">
                "{selectedApp.healthConcern}"
              </div>
            </div>

            {selectedApp.notes && (
              <div>
                <span className="text-xs text-teal-700 block uppercase font-bold">Doctor Notes & Recommendation</span>
                <div className="mt-1 bg-teal-50 p-4 rounded-lg border border-teal-200 text-slate-700 text-sm whitespace-pre-line">
                  {selectedApp.notes}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition"
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
