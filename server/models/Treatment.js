import mongoose from 'mongoose';

const timelineStageSchema = new mongoose.Schema({
  stage: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const treatmentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    successRate: {
      type: Number,
      required: true,
    },
    avgDuration: {
      type: String,
      required: true,
    },
    patientCount: {
      type: Number,
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    timeline: {
      type: [timelineStageSchema],
      required: true,
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

export const Treatment = mongoose.model('Treatment', treatmentSchema);
