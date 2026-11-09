
import mongoose from "mongoose";
import Notification, {
    NotificationType,
    RelatedEntityType,
} from "../models/Notification";
import User from "../models/User";

interface CreateNotificationData {
    recipient: string | mongoose.Types.ObjectId;
    sender?: string | mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    relatedEntityType?: RelatedEntityType;
    relatedEntityId?: string | mongoose.Types.ObjectId;
}

export const createNotification = async (
    data: CreateNotificationData
) => {
    return Notification.create(data);
};

export const createNotifications = async (
    notifications: CreateNotificationData[]
) => {
    if (!notifications.length) return [];

    return Notification.insertMany(notifications);
};

// Notify all administrators.
export const notifyAdmins = async (
    data: Omit<CreateNotificationData, "recipient">
) => {
    const admins = await User.find({ role: "admin" }).select("_id");

    if (!admins.length) return [];

    return createNotifications(
        admins.map((admin) => ({
            ...data,
            recipient: admin._id,
        }))
    );
};

// Notify a specific user.
export const notifyUser = async (
    userId: string | mongoose.Types.ObjectId,
    data: Omit<CreateNotificationData, "recipient">
) => {
    return createNotification({
        ...data,
        recipient: userId,
    });
};

// Notify multiple users without duplicate notifications.
export const notifyUsers = async (
    userIds: Array<string | mongoose.Types.ObjectId>,
    data: Omit<CreateNotificationData, "recipient">
) => {
    const uniqueIds = [...new Set(userIds.map((id) => id.toString()))];

    return createNotifications(
        uniqueIds.map((id) => ({
            ...data,
            recipient: id,
        }))
    );
};
