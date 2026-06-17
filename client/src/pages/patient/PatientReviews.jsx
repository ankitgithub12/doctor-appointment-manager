import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { reviewService, doctorService } from '../../api/services.js';
import Loader from '../../components/ui/Loader.jsx';
import Modal from '../../components/ui/Modal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import toast from 'react-hot-toast';

export default function PatientReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    doctorId: '',
    patientName: user?.name || '',
    condition: '',
    rating: 5,
    text: '',
    initials: '',
    videoUrl: '',
  });

  const getInitials = (name) => {
    if (!name) return 'PT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        patientName: user.name || '',
        initials: getInitials(user.name),
      }));
    }
  }, [user]);

  const fetchReviewsAndDoctors = async () => {
    setLoading(true);
    try {
      const [reviewsRes, doctorsRes] = await Promise.all([
        reviewService.getMyReviews(),
        doctorService.getDoctors(),
      ]);

      if (reviewsRes?.success) {
        setReviews(reviewsRes.data || []);
      }
      if (doctorsRes?.success) {
        setDoctors(doctorsRes.data || []);
      }
    } catch (error) {
      toast.error('Failed to load reviews data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsAndDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await reviewService.createReview({
        ...form,
        initials: form.initials || getInitials(form.patientName),
      });

      if (response?.success) {
        toast.success(response.message || 'Review submitted successfully!');
        setIsWriteOpen(false);
        // Reset form except name/initials
        setForm({
          doctorId: '',
          patientName: user?.name || '',
          condition: '',
          rating: 5,
          text: '',
          initials: getInitials(user?.name),
          videoUrl: '',
        });
        // Refresh reviews
        fetchReviewsAndDoctors();
      } else {
        toast.error(response?.message || 'Submission failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Reviews</h1>
          <p className="text-sm text-slate-500">Share your healing stories and moderate feedback.</p>
        </div>
        <button
          onClick={() => setIsWriteOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow transition cursor-pointer"
        >
          ✍️ Write a Review
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader size="lg" /></div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-teal-350 hover:shadow-sm transition"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Condition Treated
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm">{r.condition}</h4>
                    {r.doctor && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Reviewed Specialist: <span className="text-teal-600 font-medium">{r.doctor.name}</span>
                      </p>
                    )}
                  </div>
                  
                  <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded border uppercase ${
                    r.isApproved 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {r.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div className="text-amber-500 text-xs font-bold">
                  {'★'.repeat(r.rating)}
                </div>

                <p className="text-slate-600 text-xs md:text-sm italic leading-relaxed">
                  "{r.text}"
                </p>
              </div>

              {r.response && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-2">
                  <span className="text-[10px] text-teal-600 font-bold block uppercase tracking-wider">
                    Clinic Response
                  </span>
                  <p className="text-slate-600 text-xs mt-1 italic">
                    {r.response}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="⭐"
          title="No reviews yet"
          description="You haven't submitted any reviews or healing stories for our clinic."
          action={{
            label: "Write Your First Review",
            onClick: () => setIsWriteOpen(true)
          }}
        />
      )}

      {/* Write Review Modal */}
      <Modal isOpen={isWriteOpen} onClose={() => setIsWriteOpen(false)} title="Write Patient Review">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-slate-500 text-xs leading-relaxed">
            Your feedback helps others make informed health choices. Reviews are held for basic safety moderation before going live.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Your Display Name</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Initials (Shown next to comment)</label>
              <input
                type="text"
                maxLength={3}
                placeholder="e.g. JD"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                value={form.initials}
                onChange={(e) => setForm({ ...form, initials: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Select Doctor (Optional)</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              >
                <option value="">No specific doctor (General Clinic Review)</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} - {doc.specializations?.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Condition Treated</label>
              <input
                type="text"
                required
                placeholder="e.g. Chronic Migraine, Hair Loss"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">Rating</label>
              <div className="flex gap-2 items-center mt-1">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    type="button"
                    key={stars}
                    onClick={() => setForm({ ...form, rating: stars })}
                    className="text-2xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  >
                    <span className={stars <= form.rating ? 'text-amber-500' : 'text-slate-300'}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-bold block mb-1">YouTube Video ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. dQw4w9WgXcQ (for video reviews)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-bold block mb-1">Your Healing Story / Comment</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your treatment experience..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-500 resize-none"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsWriteOpen(false)}
              className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
