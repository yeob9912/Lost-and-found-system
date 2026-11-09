
import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
    | "USER_REGISTERED"
    | "LOST_ITEM_SUBMITTED"
    | "LOST_ITEM_APPROVED"
    | "LOST_ITEM_REJECTED"
    | "FOUND_ITEM_SUBMITTED"
    | "FOUND_ITEM_APPROVED"
    | "FOUND_ITEM_REJECTED"
    | "FOUND_MATCH_SUBMITTED"
    | "FOUND_MATCH_APPROVED"
    | "FOUND_MATCH_REJECTED"
    | "CLAIM_SUBMITTED"
    | "CLAIM_APPROVED"
    | "CLAIM_REJECTED"
    | "VERIFICATION_REQUESTED"
    | "VERIFICATION_RESPONSE_SUBMITTED"
    | "ITEM_RETURNED";

export type RelatedEntityType =
    | "User"
    | "LostItem"
    | "FoundItem"
    | "FoundMatch"
    | "Claim";

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender?: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    relatedEntityType?: RelatedEntityType;
    relatedEntityId?: mongoose.Types.ObjectId;
    isRead: boolean;
    readAt?: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
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
            required: true,
            enum: [
                "USER_REGISTERED",
                "LOST_ITEM_SUBMITTED",
                "LOST_ITEM_APPROVED",
                "LOST_ITEM_REJECTED",
                "FOUND_ITEM_SUBMITTED",
                "FOUND_ITEM_APPROVED",
                "FOUND_ITEM_REJECTED",
                "FOUND_MATCH_SUBMITTED",
                "FOUND_MATCH_APPROVED",
                "FOUND_MATCH_REJECTED",
                "CLAIM_SUBMITTED",
                "CLAIM_APPROVED",
                "CLAIM_REJECTED",
                "VERIFICATION_REQUESTED",
                "VERIFICATION_RESPONSE_SUBMITTED",
                "ITEM_RETURNED",
            ],
        },

        relatedEntityType: {
            type: String,
            enum: ["User", "LostItem", "FoundItem", "FoundMatch", "Claim"],
        },

        relatedEntityId: {
            type: Schema.Types.ObjectId,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model<INotification>(
    "Notification",
    notificationSchema
);
