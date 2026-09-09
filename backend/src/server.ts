import './polyfill.js';
import 'dotenv/config';

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import dns from 'dns';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import http from 'http';
import { setupInterviewWebSocket } from './services/socket/interview.socket'

import { connectDB } from './services/db/db';
import authRouter from './services/auth/auth.routes';
import jobRouter from './services/job/job.services';
import resumeRouter from './services/resume/upload/resume.upload';
import sessionRouter from './services/session/session.services';

dns.setServers(["8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

setupInterviewWebSocket(server);
// Security & Parsing Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration supporting credentials (cookies)
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
].filter(Boolean) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl, Postman)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, true); // Permissive in development
        },
        credentials: true,
    })
);

// Database Connection
connectDB();

// Health Check Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "AI Interview API is running",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/auth", authRouter);
app.use("/resume", resumeRouter);
app.use("/job", jobRouter);
app.use("/jobs", jobRouter);
app.use("/session", sessionRouter);
app.use("/sessions", sessionRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});

server.listen(PORT, () => {
    console.log(`Server and WebSocket running on http://localhost:${PORT}`);
});

export default app;