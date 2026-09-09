import type { Request, Response } from "express";
import { Router } from "express";
import Job from "../db/models/job";
import auth from "../auth/auth.middleware";

const jobRouter = Router();

// Protect all job routes with authentication
jobRouter.use(auth);

// 1. Create Job Handler
const createJobHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User identification missing",
            });
        }

        const { title, description, responsibilities } = req.body;
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }
        if (!description || typeof description !== 'string' || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Description is required",
            });
        }

        const job = await Job.create({
            userId: userId,
            title: title.trim(),
            description: description.trim(),
            responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to create job",
            error: error.message,
        });
    }
};

// Support both POST /job and POST /job/create
jobRouter.post('/', createJobHandler);
jobRouter.post('/create', createJobHandler);

// 2. Get All Jobs Handler
const getJobsHandler = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User identification missing",
            });
        }
        const jobs = await Job.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: jobs,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message,
        });
    }
};

// Support both GET /job and GET /job/get
jobRouter.get('/', getJobsHandler);
jobRouter.get('/get', getJobsHandler);

// 3. Get Single Job by ID Handler
const getSingleJobHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User identification missing",
            });
        }
        if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID format",
            });
        }
        const job = await Job.findOne({ _id: id, userId: userId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: job,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch job",
            error: error.message,
        });
    }
};

// Support both GET /job/:id and GET /job/get/:id
jobRouter.get('/:id', getSingleJobHandler);
jobRouter.get('/get/:id', getSingleJobHandler);

// 4. Delete Job Handler
const deleteJobHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req.user as any)?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User identification missing",
            });
        }
        if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID format",
            });
        }
        const job = await Job.findOneAndDelete({ _id: id, userId: userId });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            data: job,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to delete job",
            error: error.message,
        });
    }
};

// Support both DELETE /job/:id and DELETE /job/delete/:id
jobRouter.delete('/:id', deleteJobHandler);
jobRouter.delete('/delete/:id', deleteJobHandler);

export default jobRouter;