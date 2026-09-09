import mongoose from 'mongoose';

export const connectDB: () => Promise<void> = async () => {
    try {
        const dbUri = process.env.DB_URI;
        if (!dbUri) {
            throw new Error("DB_URI is not defined in environment variables");
        }
        await mongoose.connect(dbUri);
        console.log("Database connected successfully");
    } catch (e) {
        console.error("Error connecting to database:", e);
        process.exit(1);
    }
};