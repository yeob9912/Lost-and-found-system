
import mongoose, { Document, Schema } from "mongoose";

export type LostItemStatus =
    | "lost"
    | "match_found"
    | "returned";

export type ApprovalStatus =
    | "pending"
    | "approved"
    | "rejected";

export interface ILostItem extends Document {
    name: string;
    category: string;
    brand?: string;
    color?: string;
    location: string;
    date: Date;
    description: string;

    image: string;
    imagePublicId: string;

    status: LostItemStatus;
    approvalStatus: ApprovalStatus;

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

const lostItemSchema = new Schema<ILostItem>(
    {
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        category: {
            type: String,
            required: [true, "Item category is required"],
            trim: true,
            lowercase: true,
        },

        brand: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        color: {
            type: String,
            trim: true,
            maxlength: 50,
        },

        location: {
            type: String,
            required: [true, "Lost location is required"],
            trim: true,
            maxlength: 200,
        },

        date: {
            type: Date,
            required: [true, "Lost date is required"],
        },

        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: 5,
            maxlength: 1000,
        },

        image: {
            type: String,
            required: [true, "Item image is required"],
        },

        imagePublicId: {
            type: String,
            required: [true, "Image public ID is required"],
        },

        // Actual item recovery status
        status: {
            type: String,
            enum: ["lost", "match_found", "returned"],
            default: "lost",
        },

        // Administrator approval status
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
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

        // User who receives the returned item
        returnedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        // Admin/staff member who confirms the handover
        returnedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        returnedAt: {
            type: Date,
        },

        returnNotes: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Search indexes
lostItemSchema.index({
    name: "text",
    description: "text",
    brand: "text",
    location: "text",
});

lostItemSchema.index({ approvalStatus: 1, createdAt: -1 });
lostItemSchema.index({ status: 1 });
lostItemSchema.index({ category: 1 });
lostItemSchema.index({ reportedBy: 1 });

const LostItem = mongoose.model<ILostItem>(
    "LostItem",
    lostItemSchema
);

export default LostItem;
