import { model, Schema, type Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    fullname: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user','admin'],
            default: 'user',
        },
        fullname: {
            type: String,
            required:true,
            trim: true
        }
    },
    {
        timestamps: true,
    }
);

export const userModel = model<IUser>('User', UserSchema);
export default userModel;