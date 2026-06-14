import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    patientName: {
      type: String,
      required: [true, 'Please add patient name'],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Please add condition treated'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add rating'],
      min: 1,
      max: 5,
      default: 5,
    },
    text: {
      type: String,
      required: [true, 'Please add review description text'],
    },
    initials: {
      type: String,
      required: [true, 'Please add initials'],
      trim: true,
    },
    videoUrl: {
      type: String,
      default: '',
    },
    response: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ doctor: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ user: 1 });

// Static method to calculate average rating for a doctor
reviewSchema.statics.calcAverageRating = async function (doctorId) {
  const stats = await this.aggregate([
    { $match: { doctor: doctorId, isApproved: true } },
    {
      $group: {
        _id: '$doctor',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Doctor').findByIdAndUpdate(doctorId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await mongoose.model('Doctor').findByIdAndUpdate(doctorId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// Update doctor rating after save/remove
reviewSchema.post('save', function () {
  if (this.doctor) {
    this.constructor.calcAverageRating(this.doctor);
  }
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc && doc.doctor) {
    doc.constructor.calcAverageRating(doc.doctor);
  }
});

export const Review = mongoose.model('Review', reviewSchema);
