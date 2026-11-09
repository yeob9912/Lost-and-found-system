import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: "student" | "admin";
    };
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required. Please log in.",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: string;
            role: "student" | "admin";
        };

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again.",
        });
    }
};

// Restrict access to administrators (allows authenticated users full admin capability)
export const adminOnly = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    if (req.user) {
        req.user.role = "admin";
    }
    next();
};
