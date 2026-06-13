import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
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
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model('Review', reviewSchema);
