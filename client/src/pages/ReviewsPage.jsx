import React, { useEffect, useState } from 'react';
import { reviewService } from '../api/services.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/ui/Loader.jsx';
import toast from 'react-hot-toast';
import { FaStar, FaUser, FaPlay, FaRegClock, FaPen, FaFilter } from 'react-icons/fa';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [selectedRating, setSelectedRating] = useState('All');
  
  const { isAuthenticated, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [condition, setCondition] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getReviews();
      if (response?.success) {
        setReviews(response.data);
        setFilteredReviews(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Could not load patient reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (selectedRating === 'All') {
      setFilteredStories(reviews);
    } else {
      setFilteredStories(reviews.filter((r) => r.rating === parseInt(selectedRating)));
    }
  }, [selectedRating, reviews]);

  const setFilteredStories = (data) => {
    setFilteredReviews(data);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!text || !condition) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewService.createReview({
        patientName: user.name,
        condition,
        rating,
        text,
      });

      if (response?.success) {
        toast.success('Review submitted successfully! It will show up after admin approval.');
        setText('');
        setCondition('');
        setRating(5);
        setShowForm(false);
        fetchReviews(); // reload
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute average score and count
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-16 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-teal-650 text-xs font-bold uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Patient Feedback
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-slate-900 font-sans">
            Loved by <span className="text-teal-650 bg-clip-text">Thousands of Families</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-md mt-3">
            Read validated reviews from our patients or share your own clinical treatment experience.
          </p>
        </div>

        {/* Rating Breakdown & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-10 items-center">
          <div className="text-center md:border-r border-slate-100 py-3">
            <span className="text-5xl font-black text-slate-900 leading-tight block">{averageRating}</span>
            <div className="flex justify-center gap-0.5 text-amber-500 my-1 text-sm">
              {Array.from({ length: Math.round(parseFloat(averageRating)) }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className="text-xs text-slate-500 block font-semibold mt-1">Based on {totalReviewsCount} reviews</span>
          </div>

          <div className="space-y-1.5 px-0 md:px-6 py-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-slate-600 font-bold">{stars}</span>
                  <FaStar className="text-amber-500 flex-shrink-0" />
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-6 text-right text-slate-500 font-medium">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center py-2 flex flex-col items-center justify-center">
            {isAuthenticated ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
              >
                <FaPen /> {showForm ? 'Close Review Form' : 'Write a Review'}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">Want to share your experience?</p>
                <a
                  href="/login"
                  className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition border border-slate-200"
                >
                  Log In to Review
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Submit Review Form (Conditional) */}
        {showForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border border-teal-100 rounded-3xl p-6 shadow-md shadow-teal-500/5 mb-10 space-y-4 animate-fadeIn"
          >
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <FaPen className="text-teal-600" /> Share Your Healing Story
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Condition Treated *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asthma, Diabetes, Psoriasis"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 focus:outline-none focus:bg-white focus:border-teal-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Rating *</label>
                <div className="flex gap-1.5 items-center py-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRating(stars)}
                      className="text-lg transition cursor-pointer"
                    >
                      <FaStar className={stars <= rating ? 'text-amber-500' : 'text-slate-200'} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-2">{rating} out of 5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Review Text *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your treatment process, how the doctors helped you, and your recovery results..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-slate-800 focus:outline-none focus:bg-white focus:border-teal-500 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}

        {/* Filter Bar */}
        <div className="flex gap-2 items-center overflow-x-auto pb-4 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <FaFilter /> Star Rating:
          </span>
          {['All', '5', '4', '3', '2', '1'].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all flex-shrink-0 cursor-pointer ${
                selectedRating === star
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {star === 'All' ? 'All Reviews' : `${star} Star`}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader size="md" />
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((r) => (
              <article
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group"
                key={r._id}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-100 text-teal-700 font-bold rounded-full flex items-center justify-center text-xs">
                        {r.initials}
                      </div>
                      <div>
                        <strong className="text-slate-800 font-bold text-sm block leading-snug">{r.patientName}</strong>
                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{r.condition}</span>
                      </div>
                    </div>
                    {r.videoUrl && (
                      <button
                        onClick={() => setVideo(r.videoUrl)}
                        className="w-8 h-8 bg-teal-50 text-teal-600 border border-teal-150 rounded-full flex items-center justify-center hover:bg-teal-100 transition cursor-pointer"
                        aria-label="Play video testimonial"
                      >
                        <FaPlay className="text-[10px] ml-0.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-0.5 text-amber-500 text-xs">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed italic">
                    "{r.text}"
                  </p>
                </div>

                {r.videoUrl && (
                  <button
                    onClick={() => setVideo(r.videoUrl)}
                    className="text-xs text-teal-600 font-bold mt-4 flex items-center gap-1.5 hover:text-teal-700 transition"
                  >
                    <FaPlay className="text-[10px]" /> Watch video review
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <p className="text-slate-400 text-sm">No reviews found for this star filter.</p>
          </div>
        )}
      </div>

      {video && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setVideo(null)}
        >
          <div className="w-full max-w-xl bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:border-slate-300 shadow transition"
              aria-label="Close video"
              onClick={() => setVideo(null)}
            >
              ×
            </button>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video}?autoplay=1`}
                title="Patient video review"
                allow="accelerated-output; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
