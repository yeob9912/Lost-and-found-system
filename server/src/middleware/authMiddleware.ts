import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: "student" | "admin";
        email?: string;
    };
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: string;
            role?: "student" | "admin";
        };

        // Fetch user from DB to verify active account and live role (supports instant role promotions)
        const dbUser = await User.findById(decoded.userId).select("role email fullName");
        if (!dbUser) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists.",
            });
        }

        req.user = {
            userId: decoded.userId,
            role: dbUser.role as "student" | "admin",
            email: dbUser.email,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again.",
        });
    }
};

// Strict Role-Based Access Control: Restrict access strictly to administrators
export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Administrators only.",
        });
    }

    next();
};
