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
        const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : "";

        if (!["student", "admin"].includes(normalizedRole)) {
            return res.status(400).json({ success: false, message: "Invalid role. Role must be 'student' or 'admin'." });
        }

        const user = await User.findByIdAndUpdate(id, { role: normalizedRole }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        return res.status(200).json({ success: true, user, message: `User role updated to ${normalizedRole}.` });
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

// GET /api/admin/stats  — dashboard summary numbers and dynamic analytics
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
            lostStatusCount,
            foundStatusCount,
            claimedStatusCount,
            lostReturnedCount,
            foundReturnedCount,
            claimCompletedCount,
        ] = await Promise.all([
            User.countDocuments(),
            LostItem.countDocuments(),
            LostItem.countDocuments({ approvalStatus: "pending" }),
            FoundItem.countDocuments(),
            FoundItem.countDocuments({ approvalStatus: "pending" }),
            Claim.countDocuments(),
            Claim.countDocuments({ status: "pending" }),
            LostItem.countDocuments({ status: "lost" }),
            FoundItem.countDocuments({ status: "available" }),
            Claim.countDocuments({ status: { $in: ["pending", "verification_requested", "response_submitted", "approved"] } }),
            LostItem.countDocuments({ status: "returned" }),
            FoundItem.countDocuments({ status: "returned" }),
            Claim.countDocuments({ status: "completed" }),
        ]);

        const returnedStatusCount = lostReturnedCount + foundReturnedCount + claimCompletedCount;

        // Dynamic 6-month recovery trend aggregation from database
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();
        const trendPromises = [];
        const monthLabels: string[] = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
            const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthLabels.push(label);

            trendPromises.push(
                Promise.all([
                    LostItem.countDocuments({ status: "returned", updatedAt: { $gte: start, $lte: end } }),
                    FoundItem.countDocuments({ status: "returned", updatedAt: { $gte: start, $lte: end } }),
                    Claim.countDocuments({ status: "completed", updatedAt: { $gte: start, $lte: end } }),
                ])
            );
        }

        const trendResults = await Promise.all(trendPromises);
        const recoveryTrends = trendResults.map(([lCount, fCount, cCount], idx) => ({
            period: monthLabels[idx],
            recoveries: lCount + fCount + cCount,
        }));

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
                lostVsFound: {
                    lost: totalLost,
                    found: totalFound,
                },
                statusDistribution: [
                    { status: "Lost", count: lostStatusCount, color: "#F43F5E" },
                    { status: "Found", count: foundStatusCount, color: "#F59E0B" },
                    { status: "Claimed", count: claimedStatusCount, color: "#0EA5E9" },
                    { status: "Returned", count: returnedStatusCount, color: "#10B981" },
                ],
                recoveryTrends,
            },
        });
    } catch (err) {
        console.error("getAdminStats error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch stats." });
    }
};

