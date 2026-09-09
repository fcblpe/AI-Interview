import { model, Schema, Types, type Document } from "mongoose";

export interface IJob extends Document {
    userId: Types.ObjectId;
    title: string;
    description: string;
    responsibilities: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const jobSchema = new Schema<IJob>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        responsibilities: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const jobModel = model<IJob>("Job", jobSchema);
export default jobModel;
