import type { Request, Response } from 'express';
import { userModel } from '../db/models/user';
import { registerUser } from "./signin/signin";
import { loginUser } from "./login/login";

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    maxAge: 24 * 60 * 60 * 1000,
};

async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try {
        const response = await loginUser(email, password);
        res.cookie("token", response.token, cookieOptions);
        res.status(200).json({ success: true, message: "Logged in successfully", data: response.user, token: response.token });
    } catch (e: unknown) {
        res.status(400).json({ success: false, error: e instanceof Error ? e.message : "Login failed" });
    }
}

async function register(req: Request, res: Response) {
    const { email, password, username, fullname, role = 'user' } = req.body;
    if (!email || !password || !username || !fullname) {
        return res.status(400).json({ success: false, message: "All fields are required (email, password, username, fullname)" });
    }
    const normalizedRole = typeof role === 'string' ? role.toLowerCase() : 'user';

    if (normalizedRole !== "user" && normalizedRole !== "admin") {
        return res.status(400).json({ success: false, message: "Invalid role. Allowed roles: user, admin" });
    }
    try {
        const response = await registerUser(email, password, username, fullname,normalizedRole as 'user' | 'admin');
        res.cookie("token", response.token, cookieOptions);
        res.status(201).json({ success: true, message: "User registered successfully", data: response.user, token: response.token });
    } catch (e: unknown) {
        res.status(400).json({ success: false, error: e instanceof Error ? e.message : "Registration failed" });
    }
}

async function me(req: Request, res: Response) {
    try {
        const userId = (req.user as any)?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not identified" });
        }
        const dbUser = await userModel.findById(userId).select('-password');
        if (!dbUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User profile fetched successfully", data: dbUser });
    } catch (e: any) {
        res.status(500).json({ success: false, error: e.message || "Failed to fetch user profile" });
    }
}

function signout(req: Request, res: Response) {
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
}

export {
    login,
    register,
    signout,
    me,
};