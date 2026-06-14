import mongoose from 'mongoose';

const availableSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a doctor name'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please add qualifications'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please add experience in years'],
    },
    certifications: {
      type: [String],
      default: [],
    },
    expertise: {
      type: [String],
      default: [],
    },
    specializations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialization',
    }],
    initials: {
      type: String,
      required: [true, 'Please add initials for avatars'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    photoPublicId: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      required: [true, 'Please add a biography'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    availableSlots: {
      type: [availableSlotSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
doctorSchema.index({ name: 'text', expertise: 'text', bio: 'text' });
doctorSchema.index({ isActive: 1 });
doctorSchema.index({ specializations: 1 });

// Virtual: full appointments for this doctor
doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctor',
  justOne: false,
});

export const Doctor = mongoose.model('Doctor', doctorSchema);
