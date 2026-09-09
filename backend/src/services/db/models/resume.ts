import { Schema, model } from "mongoose";

const resumeSchema = new Schema(
  {
    fileId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    aiSummary: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    education: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    contact: {
      type: Schema.Types.Mixed,
      default: {},
    },
    certifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const resumeModel = model("Resume", resumeSchema);

export default resumeModel;