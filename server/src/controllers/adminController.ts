import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

// GET /api/admin/users  — list all users (admin only)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { search = "", role = "", page = "1", limit = "20" } = req.query as Record<string, string>;

        const filter: Record<string, unknown> = {};
        if (role && role !== "all") filter.role = role;
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { studentId: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password -profileImagePublicId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(filter),
        ]);

        return res.status(200).json({ success: true, users, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        console.error("getAllUsers error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch users." });
    }
};

// PATCH /api/admin/users/:id/role  — promote/demote
export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["student", "admin"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role." });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        return res.status(200).json({ success: true, user, message: `User role updated to ${role}.` });
    } catch (err) {
        console.error("updateUserRole error:", err);
        return res.status(500).json({ success: false, message: "Failed to update role." });
    }
};

// DELETE /api/admin/users/:id  — remove a user
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (req.user?.userId === id) {
            return res.status(400).json({ success: false, message: "You cannot delete your own account." });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        return res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (err) {
        console.error("deleteUser error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete user." });
    }
};

// GET /api/admin/stats  — dashboard summary numbers
export const getAdminStats = async (_req: AuthRequest, res: Response) => {
    try {
        const LostItem = (await import("../models/LostItem")).default;
        const FoundItem = (await import("../models/FoundItem")).default;
        const Claim = (await import("../models/Claim")).default;

        const [
            totalUsers,
            totalLost,
            pendingLost,
            totalFound,
            pendingFound,
            totalClaims,
            pendingClaims,
        ] = await Promise.all([
            User.countDocuments(),
            LostItem.countDocuments(),
            LostItem.countDocuments({ approvalStatus: "pending" }),
            FoundItem.countDocuments(),
            FoundItem.countDocuments({ approvalStatus: "pending" }),
            Claim.countDocuments(),
            Claim.countDocuments({ status: "pending" }),
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalLost,
                pendingLost,
                totalFound,
                pendingFound,
                totalClaims,
                pendingClaims,
            },
        });
    } catch (err) {
        console.error("getAdminStats error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch stats." });
    }
};

