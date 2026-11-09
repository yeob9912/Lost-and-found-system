
import { Request, Response } from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification";

// GET /api/notifications
export const getMyNotifications = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = ((req as any).user?.userId || (req as any).user?._id || (req as any).user?.id);

        const notifications = await Notification.find({
            recipient: userId,
        })
            .sort({ createdAt: -1 })
            .populate("sender", "fullName email");

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve notifications.",
        });
    }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = ((req as any).user?.userId || (req as any).user?._id || (req as any).user?.id);

        const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false,
        });

        return res.status(200).json({
            success: true,
            unreadCount: count,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve unread count.",
        });
    }
};

// PATCH /api/notifications/:id/read
export const markNotificationAsRead = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = ((req as any).user?.userId || (req as any).user?._id || (req as any).user?.id);
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID.",
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                recipient: userId,
            },
            {
                isRead: true,
                readAt: new Date(),
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            notification,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update notification.",
        });
    }
};

// PATCH /api/notifications/read-all
export const markAllNotificationsAsRead = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = ((req as any).user?.userId || (req as any).user?._id || (req as any).user?.id);

        await Notification.updateMany(
            {
                recipient: userId,
                isRead: false,
            },
            {
                isRead: true,
                readAt: new Date(),
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update notifications.",
        });
    }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = ((req as any).user?.userId || (req as any).user?._id || (req as any).user?.id);
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID.",
            });
        }

        const notification = await Notification.findOneAndDelete({
            _id: id,
            recipient: userId,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete notification.",
        });
    }
};

// DELETE /api/notifications
export const deleteAllNotifications = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = ((req as any).user?.userId || (req as any).user?._id || (req as any).user?.id);

        await Notification.deleteMany({
            recipient: userId,
        });

        return res.status(200).json({
            success: true,
            message: "All notifications deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete notifications.",
        });
    }
};
