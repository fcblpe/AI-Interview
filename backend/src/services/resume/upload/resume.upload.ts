import type { Request, Response } from "express";
import { Router } from "express";
import imageKit from "imagekit";
import multer from "multer";
import Resume from "../../db/models/resume";
import { parseResumeFromBuffer } from "../parser/resume.parser";
import { parseResumeWithAI } from "../parser/ai.parse";
import auth from "../../auth/auth.middleware";

const resumeRouter = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Please upload a PDF file."));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB limit
        files: 1
    }
});

const getClient = () => {
    return new imageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    });
};

async function uploadResume(buffer: Buffer, name: string) {
    const client = getClient();
    const result = await client.upload({
        file: buffer,
        fileName: name,
    });
    return result;
}

async function deleteResume(fileId: string) {
    const client = getClient();
    const result = await client.deleteFile(fileId);
    return result;
}

resumeRouter.post('/', auth, upload.single('resume'), async (req: Request, res: Response) => {
    let result: any;
    try {
        const userId = (req.user as any)?.id;
        const file = req.file;
        const title = req.body.title || file?.originalname;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        result = await uploadResume(file.buffer, file.originalname);

        const parsedPdf = await parseResumeFromBuffer(file.buffer);

        const aiParsedText = await parseResumeWithAI(parsedPdf.text);

        if (!aiParsedText) {
            throw new Error("AI failed to return parsed data");
        }

        let aiParsedData;
        try {
            const cleanJson = aiParsedText.replace(/```json/gi, '').replace(/```/g, '').trim();
            aiParsedData = JSON.parse(cleanJson);
        } catch (error) {
            console.error("Failed to parse AI response as JSON:", aiParsedText);
            throw new Error("Invalid JSON format from AI response");
        }

        const newResume = new Resume({
            userId: userId,
            fileId: result.fileId,
            fileUrl: result.url,
            fileName: file.originalname,
            title: aiParsedData.name ? `${aiParsedData.name} ${aiParsedData.title ? `- ${aiParsedData.title}` : ''}` : (aiParsedData.title || title),
            content: aiParsedData.content || aiParsedData.Content || parsedPdf.text,
            aiSummary: aiParsedData.aiSummary || aiParsedData.AISummary || aiParsedData.AISummery || aiParsedData.aisummery,
            experience: aiParsedData.experience || [],
            skills: aiParsedData.skills || aiParsedData.Skills || [],
            education: aiParsedData.education || [],
            contact: aiParsedData.contact || {},
            certifications: aiParsedData.certifications || [],
        });
        await newResume.save();
        res.status(200).json({
            success: true,
            message: "Resume uploaded and parsed successfully",
            data: newResume,
        });
    } catch (err: any) {
        if (result?.fileId) {
            try {
                await deleteResume(result.fileId);
            } catch (cleanupErr) {
                console.error("Failed to clean up ImageKit file after error:", cleanupErr);
            }
        }

        res.status(500).json({
            success: false,
            message: "Something went wrong while processing resume",
            error: err.message
        });
    }
});

resumeRouter.get('/', auth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const resumes = await Resume.find({ userId: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Resumes fetched successfully",
            data: resumes,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
});

resumeRouter.get('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "No ID provided",
            });
        }

        const userId = (req.user as any)?.id;
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isValidObjectId
            ? { $or: [{ _id: id }, { fileId: id }], userId }
            : { fileId: id, userId };

        const resume = await Resume.findOne(query);
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Resume fetched successfully",
            data: resume,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
});

resumeRouter.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "No ID provided",
            });
        }

        const userId = (req.user as any)?.id;
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query = isValidObjectId
            ? { $or: [{ _id: id }, { fileId: id }], userId }
            : { fileId: id, userId };

        const resume = await Resume.findOne(query);
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found",
            });
        }
        await deleteResume(resume.fileId);
        await resume.deleteOne();
        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err.message
        });
    }
});

export default resumeRouter;
