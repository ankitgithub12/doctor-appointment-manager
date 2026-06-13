import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    patientName: {
      type: String,
      required: [true, 'Please add the patient name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please add a preferred date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please add a preferred time slot'],
      trim: true,
    },
    healthConcern: {
      type: String,
      required: [true, 'Please describe your health concern'],
      trim: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Please assign a doctor'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
