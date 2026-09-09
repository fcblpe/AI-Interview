import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../../db/models/user';

export async function loginUser(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
        { id: user._id.toString(), role: user.role, email: user.email },
        jwtSecret,
        { expiresIn: "1d" }
    );

    const userWithoutPassword = await userModel.findById(user._id).select('-password');
    return { token, user: userWithoutPassword };
}