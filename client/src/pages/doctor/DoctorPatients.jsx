import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { FaUsers } from 'react-icons/fa';

export default function DoctorPatients() {
  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900">My Patients</h1>
      </div>
      <EmptyState icon={<FaUsers />} title="Patient Records" description="Your patient records will appear here once appointments are linked to your doctor profile." />
    </div>
  );
}
