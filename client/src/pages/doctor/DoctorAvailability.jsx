import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function DoctorAvailability() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">Availability Schedule</h1>
      <p className="text-slate-400 text-sm">Manage your weekly consultation schedule.</p>
      <EmptyState icon="🕐" title="Schedule Management" description="Set your available days and time slots for patient appointments. Link your doctor profile via admin to activate this feature." />
    </div>
  );
}
