import { model, Schema, type Document, Types } from "mongoose";

export interface ITranscriptMessage {
  speaker: "user" | "ai" | "system";
  text: string;
  timestamp?: Date;
}

export interface IInterviewSession extends Document {
  userId: Types.ObjectId;
  jobId?: Types.ObjectId;
  resumeId?: Types.ObjectId;
  title: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  voiceName: "Zephyr" | "Puck" | "Charon" | "Kore" | "Fenrir" | "Aoede";
  difficulty: "easy" | "medium" | "hard";
  sessionType: "technical" | "behavioral" | "mixed";
  transcript: ITranscriptMessage[];
  aiFeedback?: string;
  score?: number;
  durationSeconds?: number;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transcriptMessageSchema = new Schema<ITranscriptMessage>(
  {
    speaker: {
      type: String,
      enum: ["user", "ai", "system"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const interviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
    },
    title: {
      type: String,
      default: "AI Voice Mock Interview",
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },
    voiceName: {
      type: String,
      enum: ["Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Aoede"],
      default: "Zephyr",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    sessionType: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      default: "mixed",
    },
    transcript: {
      type: [transcriptMessageSchema],
      default: [],
    },
    aiFeedback: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const sessionModel = model<IInterviewSession>("InterviewSession", interviewSessionSchema);


export default sessionModel;
