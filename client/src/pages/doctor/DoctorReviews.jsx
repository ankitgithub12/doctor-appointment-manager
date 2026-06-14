import React from 'react';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function DoctorReviews() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-extrabold">My Reviews</h1>
      <EmptyState icon="⭐" title="Patient Reviews" description="Reviews from patients about your consultations will appear here." />
    </div>
  );
}
