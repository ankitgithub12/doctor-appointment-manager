import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { FaClock } from 'react-icons/fa';

export default function DoctorAvailability() {
  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Availability Schedule</h1>
        <p className="text-slate-500 text-xs font-semibold">Manage your weekly consultation schedule.</p>
      </div>
      <EmptyState icon={<FaClock />} title="Schedule Management" description="Set your available days and time slots for patient appointments. Link your doctor profile via admin to activate this feature." />
    </div>
  );
}
