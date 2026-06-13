import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
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
    initials: {
      type: String,
      required: [true, 'Please add initials for avatars'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      required: [true, 'Please add a biography'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
