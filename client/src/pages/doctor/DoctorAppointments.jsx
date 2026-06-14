import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { FaCalendarAlt } from 'react-icons/fa';

export default function DoctorAppointments() {
  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">My Appointments</h1>
        <p className="text-slate-500 text-xs font-semibold">View and manage appointments assigned to you.</p>
      </div>
      <EmptyState icon={<FaCalendarAlt />} title="Appointment Management" description="Link your doctor profile to your user account via admin to view your assigned appointments here." />
    </div>
  );
}
