
import { Request, Response } from "express";
import mongoose from "mongoose";

import LostItem from "../models/LostItem";
import User from "../models/User";
import Notification from "../models/Notification";
import cloudinary from "../config/cloudinary";

interface AuthRequest extends Request {
    user?: {
        id?: string;
        _id?: string;
        role?: string;
    };
}

const getUserId = (req: AuthRequest): string | undefined => {
    return req.user?.id || req.user?._id;
};

const isAdmin = (req: AuthRequest): boolean => {
    return req.user?.role === "admin";
};

// Create notification
const sendNotification = async (
    userId: mongoose.Types.ObjectId | string,
    title: string,
    message: string,
    relatedId: mongoose.Types.ObjectId | string
): Promise<void> => {
    await Notification.create({
        recipient: userId,
        title,
        message,
        type: "LOST_ITEM_SUBMITTED",
        relatedEntityType: "LostItem",
        relatedEntityId: relatedId,
        isRead: false,
    });
};

// Notify all administrators
const notifyAdmins = async (
    title: string,
    message: string,
    relatedId: mongoose.Types.ObjectId
): Promise<void> => {
    const admins = await User.find({ role: "admin" }).select("_id");

    await Promise.all(
        admins.map((admin) =>
            sendNotification(admin._id, title, message, relatedId)
        )
    );
};

// Upload image to Cloudinary
const uploadImage = (
    buffer: Buffer
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "astu-lost-and-found/lost-items",
                resource_type: "image",
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error || new Error("Image upload failed"));
                }

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        stream.end(buffer);
    });
};

// Delete Cloudinary image
const deleteImage = async (publicId: string): Promise<void> => {
    if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });
    }
};

// 1. STUDENT REPORTS A LOST ITEM
export const createLostItem = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    let uploadedPublicId = "";

    try {
        const userId = getUserId(req);

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const {
            name,
            category,
            brand,
            color,
            location,
            date,
            description,
        } = req.body;

        if (
            !name?.trim() ||
            !category?.trim() ||
            !location?.trim() ||
            !date ||
            !description?.trim()
        ) {
            res.status(400).json({
                success: false,
                message: "Please provide all required item details",
            });
            return;
        }

        if (Number.isNaN(new Date(date).getTime())) {
            res.status(400).json({
                success: false,
                message: "Invalid lost date",
            });
            return;
        }

        let imageUrl = "";
        let publicId = "";

        if (req.file) {
            const uploaded = await uploadImage(req.file.buffer);
            uploadedPublicId = uploaded.public_id;
            imageUrl = uploaded.secure_url;
            publicId = uploaded.public_id;
        } else if (req.body.image) {
            imageUrl = req.body.image;
            publicId = "external_ref";
        } else {
            res.status(400).json({
                success: false,
                message: "Item image is required",
            });
            return;
        }

        const lostItem = await LostItem.create({
            name,
            category,
            brand,
            color,
            location,
            date,
            description,
            image: imageUrl,
            imagePublicId: publicId,
            reportedBy: userId,

            // Every new report waits for admin review
            approvalStatus: "pending",
            status: "lost",
        });

        // Notify administrators
        try {
            await notifyAdmins(
                "New Lost Item Report",
                `A new lost item report for "${lostItem.name}" requires your approval.`,
                lostItem._id
            );
        } catch (notificationError) {
            console.error("Admin notification error:", notificationError);
        }

        res.status(201).json({
            success: true,
            message: "Lost item submitted successfully. Waiting for admin approval.",
            data: lostItem,
        });
    } catch (error) {
        if (uploadedPublicId) {
            try {
                await deleteImage(uploadedPublicId);
            } catch (cleanupError) {
                console.error("Image cleanup error:", cleanupError);
            }
        }

        console.error("Create lost item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to submit lost item",
        });
    }
};

// 2. GET PUBLICLY APPROVED LOST ITEMS
export const getLostItems = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            search,
            category,
            status,
            location,
            page = "1",
            limit = "12",
        } = req.query;

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, Number(limit) || 12));

        const filter: Record<string, any> = {
            approvalStatus: "approved",
        };

        // Returned items are not displayed in active Lost Items
        if (status && typeof status === "string") {
            if (!["lost", "match_found", "returned"].includes(status)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid item status",
                });
                return;
            }

            filter.status = status;
        } else {
            filter.status = { $in: ["lost", "match_found"] };
        }

        if (category && typeof category === "string") {
            filter.category = category.trim().toLowerCase();
        }

        if (search && typeof search === "string" && search.trim()) {
            filter.$text = { $search: search.trim() };
        }

        if (location && typeof location === "string") {
            const escaped = location.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.location = { $regex: escaped, $options: "i" };
        }

        const totalItems = await LostItem.countDocuments(filter);

        const items = await LostItem.find(filter)
            .populate("reportedBy", "fullName email studentId")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            count: items.length,
            totalItems,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalItems / limitNumber),
            data: items,
        });
    } catch (error) {
        console.error("Get lost items error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve lost items",
        });
    }
};

// 3. GET ONE APPROVED LOST ITEM
export const getLostItemById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
            return;
        }

        const item = await LostItem.findOne({
            _id: id,
            approvalStatus: "approved",
        }).populate("reportedBy", "fullName email studentId");

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Lost item not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error("Get lost item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve lost item",
        });
    }
};

// 4. GET MY LOST ITEM REPORTS
export const getMyLostItems = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const items = await LostItem.find({
            reportedBy: userId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        console.error("Get my lost items error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve your reports",
        });
    }
};

// 5. UPDATE MY LOST ITEM REPORT
export const updateLostItem = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    let newPublicId = "";

    try {
        const userId = getUserId(req);
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
            return;
        }

        const item = await LostItem.findById(id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Lost item not found",
            });
            return;
        }

        if (item.reportedBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: "You cannot edit another user's report",
            });
            return;
        }

        // Do not allow editing reports already approved or returned.
        if (
            !["pending", "rejected"].includes(item.approvalStatus) ||
            item.status !== "lost"
        ) {
            res.status(400).json({
                success: false,
                message: "This report can no longer be edited",
            });
            return;
        }

        const {
            name,
            category,
            brand,
            color,
            location,
            date,
            description,
        } = req.body;

        if (date !== undefined && Number.isNaN(new Date(date).getTime())) {
            res.status(400).json({
                success: false,
                message: "Invalid lost date",
            });
            return;
        }

        if (name !== undefined) item.name = name;
        if (category !== undefined) item.category = category.toLowerCase();
        if (brand !== undefined) item.brand = brand;
        if (color !== undefined) item.color = color;
        if (location !== undefined) item.location = location;
        if (date !== undefined) item.date = new Date(date);
        if (description !== undefined) item.description = description;

        const oldPublicId = item.imagePublicId;

        if (req.file) {
            const uploaded = await uploadImage(req.file.buffer);
            newPublicId = uploaded.public_id;

            item.image = uploaded.secure_url;
            item.imagePublicId = uploaded.public_id;
        }

        // Editing a rejected report sends it for review again
        if (item.approvalStatus === "rejected") {
            item.approvalStatus = "pending";
            item.rejectionReason = undefined;
            item.reviewedBy = undefined;
            item.reviewedAt = undefined;
        }

        await item.save();

        if (newPublicId && oldPublicId) {
            try {
                await deleteImage(oldPublicId);
            } catch (error) {
                console.error("Old image deletion error:", error);
            }
        }

        if (item.approvalStatus === "pending") {
            try {
                await notifyAdmins(
                    "Lost Item Report Updated",
                    `The report for "${item.name}" is waiting for admin review.`,
                    item._id
                );
            } catch (error) {
                console.error("Admin notification error:", error);
            }
        }

        res.status(200).json({
            success: true,
            message: "Lost item updated successfully",
            data: item,
        });
    } catch (error) {
        if (newPublicId) {
            try {
                await deleteImage(newPublicId);
            } catch (cleanupError) {
                console.error("New image cleanup error:", cleanupError);
            }
        }

        console.error("Update lost item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update lost item",
        });
    }
};

// 6. DELETE MY LOST ITEM REPORT
export const deleteLostItem = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
            return;
        }

        const item = await LostItem.findById(id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Lost item not found",
            });
            return;
        }

        const owner = item.reportedBy.toString() === userId;

        if (!owner && !isAdmin(req)) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to delete this report",
            });
            return;
        }

        if (item.status === "match_found" || item.status === "returned") {
            res.status(400).json({
                success: false,
                message: "This report has an active or completed recovery process and cannot be deleted",
            });
            return;
        }

        await item.deleteOne();

        try {
            await deleteImage(item.imagePublicId);
        } catch (error) {
            console.error("Cloudinary deletion error:", error);
        }

        res.status(200).json({
            success: true,
            message: "Lost item report deleted successfully",
        });
    } catch (error) {
        console.error("Delete lost item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete lost item",
        });
    }
};

// 7. ADMIN: GET ALL REPORTS FOR REVIEW
export const getAllLostItemReports = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!isAdmin(req)) {
            res.status(403).json({
                success: false,
                message: "Administrator access required",
            });
            return;
        }

        const { approvalStatus, page = "1", limit = "20" } = req.query;

        const filter: Record<string, any> = {};

        if (approvalStatus && typeof approvalStatus === "string") {
            if (!["pending", "approved", "rejected"].includes(approvalStatus)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid approval status",
                });
                return;
            }

            filter.approvalStatus = approvalStatus;
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, Number(limit) || 20));

        const totalItems = await LostItem.countDocuments(filter);

        const reports = await LostItem.find(filter)
            .populate("reportedBy", "fullName email studentId")
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            count: reports.length,
            totalItems,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalItems / limitNumber),
            data: reports,
        });
    } catch (error) {
        console.error("Admin get reports error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve reports",
        });
    }
};

// 8. ADMIN: APPROVE LOST ITEM REPORT
export const approveLostItem = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;

        if (!isAdmin(req) || !adminId) {
            res.status(403).json({
                success: false,
                message: "Administrator access required",
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
            return;
        }

        const item = await LostItem.findById(id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Lost item not found",
            });
            return;
        }

        if (item.approvalStatus !== "pending") {
            res.status(400).json({
                success: false,
                message: "Only pending reports can be approved",
            });
            return;
        }

        item.approvalStatus = "approved";
        item.status = "lost";
        item.rejectionReason = undefined;
        item.reviewedBy = new mongoose.Types.ObjectId(adminId);
        item.reviewedAt = new Date();

        await item.save();

        try {
            await sendNotification(
                item.reportedBy,
                "Lost Item Report Approved",
                `Your lost item report for "${item.name}" has been approved and is now publicly visible.`,
                item._id
            );
        } catch (error) {
            console.error("Owner notification error:", error);
        }

        res.status(200).json({
            success: true,
            message: "Lost item report approved successfully",
            data: item,
        });
    } catch (error) {
        console.error("Approve lost item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to approve lost item",
        });
    }
};

// 9. ADMIN: REJECT LOST ITEM REPORT
export const rejectLostItem = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;
        const { reason } = req.body;

        if (!isAdmin(req) || !adminId) {
            res.status(403).json({
                success: false,
                message: "Administrator access required",
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
            return;
        }

        if (!reason?.trim()) {
            res.status(400).json({
                success: false,
                message: "Please provide a rejection reason",
            });
            return;
        }

        const item = await LostItem.findById(id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Lost item not found",
            });
            return;
        }

        if (item.approvalStatus !== "pending") {
            res.status(400).json({
                success: false,
                message: "Only pending reports can be rejected",
            });
            return;
        }

        item.approvalStatus = "rejected";
        item.rejectionReason = reason.trim();
        item.reviewedBy = new mongoose.Types.ObjectId(adminId);
        item.reviewedAt = new Date();

        await item.save();

        try {
            await sendNotification(
                item.reportedBy,
                "Lost Item Report Rejected",
                `Your report for "${item.name}" was rejected. Reason: ${reason.trim()}`,
                item._id
            );
        } catch (error) {
            console.error("Owner notification error:", error);
        }

        res.status(200).json({
            success: true,
            message: "Lost item report rejected",
            data: item,
        });
    } catch (error) {
        console.error("Reject lost item error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reject lost item",
        });
    }
};

// 10. ADMIN: CONFIRM SUCCESSFUL ITEM RETURN
export const confirmLostItemReturn = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;
        const { returnedTo, returnNotes } = req.body;

        if (!isAdmin(req) || !adminId) {
            res.status(403).json({
                success: false,
                message: "Administrator access required",
            });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                success: false,
                message: "Invalid item ID",
            });
            return;
        }

        const item = await LostItem.findById(id);

        if (!item) {
            res.status(404).json({
                success: false,
                message: "Lost item not found",
            });
            return;
        }

        if (
            item.approvalStatus !== "approved" ||
            item.status !== "match_found"
        ) {
            res.status(400).json({
                success: false,
                message: "Only approved matched items can be marked as returned",
            });
            return;
        }

        if (!returnedTo || !mongoose.Types.ObjectId.isValid(returnedTo)) {
            res.status(400).json({
                success: false,
                message: "A valid receiving user ID is required",
            });
            return;
        }

        // Only the original reporter can receive their lost item
        if (item.reportedBy.toString() !== returnedTo) {
            res.status(400).json({
                success: false,
                message: "The receiving user must be the original item owner",
            });
            return;
        }

        item.status = "returned";
        item.returnedTo = new mongoose.Types.ObjectId(returnedTo);
        item.returnedBy = new mongoose.Types.ObjectId(adminId);
        item.returnedAt = new Date();
        item.returnNotes = returnNotes?.trim() || "";

        await item.save();

        try {
            await sendNotification(
                item.reportedBy,
                "Lost Item Returned",
                `Your item "${item.name}" has been marked as successfully returned.`,
                item._id
            );
        } catch (error) {
            console.error("Return notification error:", error);
        }

        res.status(200).json({
            success: true,
            message: "Item return confirmed successfully",
            data: item,
        });
    } catch (error) {
        console.error("Confirm item return error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to confirm item return",
        });
    }
};
