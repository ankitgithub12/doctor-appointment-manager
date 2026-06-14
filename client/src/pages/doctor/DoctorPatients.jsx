import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function DoctorPatients() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">My Patients</h1>
      <EmptyState icon="👥" title="Patient Records" description="Your patient records will appear here once appointments are linked to your doctor profile." />
    </div>
  );
}
