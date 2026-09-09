import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No access token provided",
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined");
            return res.status(500).json({
                success: false,
                message: "Internal server error: Authentication configuration missing",
            });
        }

        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded as any;
        next();
    } catch (e: any) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};

export default auth;