
import mongoose, { Document, Schema } from "mongoose";

export type ClaimStatus =
    | "pending"
    | "verification_requested"
    | "response_submitted"
    | "approved"
    | "rejected"
    | "completed";

export interface IVerificationAttachment {
    url: string;
    publicId: string;
}

export interface IVerificationMessage {
    sender: mongoose.Types.ObjectId;
    senderRole: "admin" | "user";
    message: string;
    attachments: IVerificationAttachment[];
    createdAt: Date;
}

export interface IClaim extends Document {
    foundItem: mongoose.Types.ObjectId;
    claimedBy: mongoose.Types.ObjectId;

    explanation: string;
    ownershipEvidence: IVerificationAttachment[];

    status: ClaimStatus;

    verificationMessages: IVerificationMessage[];
    verificationRequestedAt?: Date;
    lastResponseAt?: Date;

    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    rejectionReason?: string;

    completedBy?: mongoose.Types.ObjectId;
    completedAt?: Date;
    returnNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const attachmentSchema = new Schema<IVerificationAttachment>(
    {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const verificationMessageSchema =
    new Schema<IVerificationMessage>(
        {
            sender: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            senderRole: {
                type: String,
                enum: ["admin", "user"],
                required: true,
            },
            message: {
                type: String,
                required: true,
                trim: true,
            },
            attachments: {
                type: [attachmentSchema],
                default: [],
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
        { _id: true }
    );

const claimSchema = new Schema<IClaim>(
    {
        foundItem: {
            type: Schema.Types.ObjectId,
            ref: "FoundItem",
            required: true,
        },
        claimedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        explanation: {
            type: String,
            required: true,
            trim: true,
        },
        ownershipEvidence: {
            type: [attachmentSchema],
            default: [],
        },

        status: {
            type: String,
            enum: [
                "pending",
                "verification_requested",
                "response_submitted",
                "approved",
                "rejected",
                "completed",
            ],
            default: "pending",
        },

        verificationMessages: {
            type: [verificationMessageSchema],
            default: [],
        },
        verificationRequestedAt: Date,
        lastResponseAt: Date,

        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: Date,
        rejectionReason: String,

        completedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        completedAt: Date,
        returnNotes: String,
    },
    {
        timestamps: true,
    }
);

// Prevent the same user from submitting multiple active claims
// for the same found item.
claimSchema.index(
    { foundItem: 1, claimedBy: 1 },
    {
        unique: true,
    }
);

claimSchema.index({ status: 1, createdAt: -1 });
claimSchema.index({ claimedBy: 1, createdAt: -1 });
claimSchema.index({ foundItem: 1 });

const Claim = mongoose.model<IClaim>("Claim", claimSchema);

export default Claim;
