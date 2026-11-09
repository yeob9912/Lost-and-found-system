
import mongoose, { Document, Schema } from "mongoose";

export type FoundItemStatus = "available" | "claimed" | "returned";
export type FoundItemApprovalStatus = "pending" | "approved" | "rejected";

export interface IFoundItem extends Document {
    name: string;
    category: string;
    brand?: string;
    color?: string;
    foundLocation: string;
    foundDate: Date;
    description: string;
    image: string;
    imagePublicId: string;

    status: FoundItemStatus;
    approvalStatus: FoundItemApprovalStatus;

    rejectionReason?: string;

    reportedBy: mongoose.Types.ObjectId;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;

    returnedTo?: mongoose.Types.ObjectId;
    returnedBy?: mongoose.Types.ObjectId;
    returnedAt?: Date;
    returnNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const foundItemSchema = new Schema<IFoundItem>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            trim: true,
        },
        foundLocation: {
            type: String,
            required: true,
            trim: true,
        },
        foundDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        imagePublicId: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["available", "claimed", "returned"],
            default: "available",
        },
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rejectionReason: {
            type: String,
        },

        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: {
            type: Date,
        },

        returnedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        returnedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        returnedAt: {
            type: Date,
        },
        returnNotes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

foundItemSchema.index({ approvalStatus: 1, createdAt: -1 });
foundItemSchema.index({ status: 1 });
foundItemSchema.index({ category: 1 });
foundItemSchema.index({ reportedBy: 1 });

const FoundItem = mongoose.model<IFoundItem>(
    "FoundItem",
    foundItemSchema
);

export default FoundItem;
