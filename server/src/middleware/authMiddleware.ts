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
            userId?: string;
            id?: string;
            role?: "student" | "admin";
        };

        const targetId = decoded.userId || decoded.id;
        if (!targetId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token structure.",
            });
        }

        // Fetch user from DB to verify active account and live role (supports instant role promotions)
        const dbUser = await User.findById(targetId).select("role email fullName");
        if (!dbUser) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists.",
            });
        }

        const userRole = String(dbUser.role || "student").trim().toLowerCase() as "student" | "admin";

        req.user = {
            userId: String(targetId),
            role: userRole,
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
    const role = req.user?.role ? String(req.user.role).trim().toLowerCase() : "";
    if (role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Administrators only.",
        });
    }

    next();
};

// Strict Role-Based Access Control: Restrict access strictly to students
export const studentOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const role = req.user?.role ? String(req.user.role).trim().toLowerCase() : "";
    if (role !== "student") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Students only. Administrators cannot perform student actions.",
        });
    }

    next();
};
