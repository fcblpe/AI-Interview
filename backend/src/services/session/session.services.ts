import { Router, type Request, type Response } from "express";
import sessionModel from "../db/models/session";
import Resume from "../db/models/resume";
import Job from "../db/models/job";
import auth from "../auth/auth.middleware";

const sessionRouter = Router();

// Protect all session routes with authentication
sessionRouter.use(auth);

const VALID_VOICES = ["Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Aoede"] as const;
const VALID_DIFFICULTIES = ["easy", "medium", "hard"] as const;
const VALID_SESSION_TYPES = ["technical", "behavioral", "mixed"] as const;
const VALID_STATUSES = ["scheduled", "in-progress", "completed", "cancelled"] as const;

// 1. Create Interview Session
sessionRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const {
            jobId,
            resumeId,
            title,
            voiceName = "Zephyr",
            difficulty = "medium",
            sessionType = "mixed"
        } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User identification missing",
            });
        }

        if (resumeId) {
            if (!/^[0-9a-fA-F]{24}$/.test(resumeId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid resume ID format",
                });
            }
            const resumeExists = await Resume.findOne({ _id: resumeId, userId });
            if (!resumeExists) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found or does not belong to you",
                });
            }
        }

        if (jobId) {
            if (!/^[0-9a-fA-F]{24}$/.test(jobId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid job ID format",
                });
            }
            const jobExists = await Job.findById(jobId);
            if (!jobExists) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found",
                });
            }
        }

        if (voiceName && !VALID_VOICES.includes(voiceName)) {
            return res.status(400).json({
                success: false,
                message: `Invalid voiceName. Allowed voices: ${VALID_VOICES.join(', ')}`,
            });
        }

        if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
            return res.status(400).json({
                success: false,
                message: `Invalid difficulty. Allowed options: ${VALID_DIFFICULTIES.join(', ')}`,
            });
        }

        if (sessionType && !VALID_SESSION_TYPES.includes(sessionType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid sessionType. Allowed options: ${VALID_SESSION_TYPES.join(', ')}`,
            });
        }

        const session = await sessionModel.create({
            userId,
            jobId: jobId || undefined,
            resumeId: resumeId || undefined,
            title: title?.trim() || "AI Voice Mock Interview",
            voiceName,
            difficulty,
            sessionType,
            status: "scheduled",
            transcript: [],
        });

        const populatedSession = await sessionModel
            .findById(session._id)
            .populate('jobId', 'title description responsibilities')
            .populate('resumeId', 'fileName title aiSummary skills experience');

        res.status(201).json({
            success: true,
            message: "Interview session created successfully",
            data: populatedSession,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to create interview session",
            error: error.message,
        });
    }
});

// 2. Get All Sessions for Authenticated User (Must be before /:id)
sessionRouter.get('/my', async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const sessions = await sessionModel
            .find({ userId })
            .populate('jobId', 'title description')
            .populate('resumeId', 'fileName title aiSummary')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "User sessions fetched successfully",
            data: sessions,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user sessions",
            error: error.message,
        });
    }
});

// 3. Get Single Session by ID
sessionRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)?.id;

        if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid session ID format",
            });
        }

        const session = await sessionModel
            .findOne({ _id: id, userId })
            .populate('jobId', 'title description responsibilities')
            .populate('resumeId', 'fileName title aiSummary skills experience');

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Interview session not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Session fetched successfully",
            data: session,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch session",
            error: error.message,
        });
    }
});

// 4. Update Session Status / End Interview
sessionRouter.patch('/:id/status', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)?.id;
        const { status, durationSeconds, aiFeedback, score } = req.body;

        if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid session ID format",
            });
        }

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed statuses: ${VALID_STATUSES.join(', ')}`,
            });
        }

        const updateData: Record<string, any> = {};
        if (status) updateData.status = status;
        if (typeof durationSeconds === 'number') updateData.durationSeconds = durationSeconds;
        if (aiFeedback) updateData.aiFeedback = aiFeedback;
        if (typeof score === 'number') updateData.score = score;

        if (status === 'in-progress' && !updateData.startedAt) {
            updateData.startedAt = new Date();
        }
        if (status === 'completed' || status === 'cancelled') {
            updateData.endedAt = new Date();
        }

        const updatedSession = await sessionModel.findOneAndUpdate(
            { _id: id, userId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedSession) {
            return res.status(404).json({
                success: false,
                message: "Interview session not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Session updated successfully",
            data: updatedSession,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to update session",
            error: error.message,
        });
    }
});

// 5. Delete Session
sessionRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)?.id;

        if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid session ID format",
            });
        }

        const session = await sessionModel.findOneAndDelete({ _id: id, userId });
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Interview session not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Interview session deleted successfully",
            data: session,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete session",
            error: error.message,
        });
    }
});

export default sessionRouter;