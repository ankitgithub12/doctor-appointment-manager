import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function DoctorAppointments() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">My Appointments</h1>
      <p className="text-slate-400 text-sm">View and manage appointments assigned to you.</p>
      <EmptyState icon="📅" title="Appointment Management" description="Link your doctor profile to your user account via admin to view your assigned appointments here." />
    </div>
  );
}
