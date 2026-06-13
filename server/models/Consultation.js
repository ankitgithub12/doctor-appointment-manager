import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
      trim: true,
    },
    healthConcern: {
      type: String,
      required: [true, 'Please add health concern'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export const Consultation = mongoose.model('Consultation', consultationSchema);
