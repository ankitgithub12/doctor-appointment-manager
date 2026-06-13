import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add patient name'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please add patient age'],
    },
    condition: {
      type: String,
      required: [true, 'Please add medical condition'],
      trim: true,
    },
    initials: {
      type: String,
      required: [true, 'Please add initials'],
      trim: true,
    },
    before: {
      type: String,
      required: [true, 'Please add symptoms before treatment'],
    },
    after: {
      type: String,
      required: [true, 'Please add description of outcome after treatment'],
    },
    duration: {
      type: String,
      required: [true, 'Please add treatment duration'],
      trim: true,
    },
    youtubeId: {
      type: String,
      default: '',
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

export const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
