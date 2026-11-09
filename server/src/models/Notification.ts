import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: string;
    relatedId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            default: "lost_item",
        },
        relatedId: {
            type: Schema.Types.ObjectId,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model<INotification>(
    "Notification",
    notificationSchema
);

export default Notification;

