import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../../db/models/user';

export async function registerUser(
    email: string,
    password: string,
    username: string,
    fullname: string,
    role: 'user' | 'admin'
) {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({
        email: normalizedEmail,
        password: hashPassword,
        username: normalizedUsername,
        fullname,
        role,
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        { id: createdUser._id.toString(), role: createdUser.role, email: createdUser.email },
        jwtSecret,
        { expiresIn: "1d" }
    );

    const userWithoutPassword = await userModel.findById(createdUser._id).select('-password');
    return { token, user: userWithoutPassword };
}