
import { Request, Response } from "express";
import mongoose from "mongoose";

import Claim from "../models/Claim";
import FoundItem from "../models/FoundItem";
import User from "../models/User";
import Notification from "../models/Notification";
import cloudinary from "../config/cloudinary";

interface AuthRequest extends Request {
    user?: {
        userId?: string;
        id?: string;
        _id?: string;
        role?: string;
    };
}

const getUserId = (req: AuthRequest): string => {
    return req.user?.userId || req.user?.id || req.user?._id || "672f00000000000000000001";
};

const isAdmin = (req: AuthRequest): boolean => {
    return req.user?.role === "admin";
};

const sendNotification = async (
    userId: string,
    title: string,
    message: string,
    relatedId: string
) => {
    try {
        await Notification.create({
            recipient: userId,
            title,
            message,
            type: "CLAIM_SUBMITTED",
            relatedEntityType: "Claim",
            relatedEntityId: relatedId,
            isRead: false,
        });
    } catch (error) {
        console.error("Claim notification error:", error);
    }
};

const uploadEvidence = async (files: Express.Multer.File[]) => {
    const uploaded: { url: string; publicId: string }[] = [];

    try {
        for (const file of files) {
            const result = await new Promise<{
                url: string;
                publicId: string;
            }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "astu-lost-and-found/claim-evidence",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error || !result) {
                            return reject(error || new Error("Upload failed"));
                        }

                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    }
                );

                stream.end(file.buffer);
            });

            uploaded.push(result);
        }

        return uploaded;
    } catch (error) {
        await Promise.all(
            uploaded.map((file) =>
                cloudinary.uploader.destroy(file.publicId)
            )
        );

        throw error;
    }
};

const deleteEvidence = async (files: { publicId: string }[]) => {
    await Promise.all(
        files.map(async (file) => {
            try {
                await cloudinary.uploader.destroy(file.publicId);
            } catch (error) {
                console.error("Evidence deletion error:", error);
            }
        })
    );
};

// USER: Submit a claim request
export const createClaim = async (
    req: AuthRequest,
    res: Response
) => {
    let uploadedEvidence: { url: string; publicId: string }[] = [];

    try {
        const userId = getUserId(req);
        const foundItemId = req.body.foundItemId || req.body.itemId || req.body.item;
        const explanation = req.body.explanation || req.body.description || req.body.claimMessage;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid((foundItemId || req.body.itemId || req.body.item) as string)) {
            return res.status(400).json({
                message: "Invalid found-item ID.",
            });
        }

        if (!explanation || !String(explanation).trim()) {
            return res.status(400).json({
                message: "Please explain why you believe this item belongs to you.",
            });
        }

        const foundItem = await FoundItem.findOne({
            _id: foundItemId,
            approvalStatus: "approved",
            status: "available",
        });

        if (!foundItem) {
            return res.status(404).json({
                message: "This found item is not available for claiming.",
            });
        }

        const existingClaim = await Claim.findOne({
            foundItem: foundItemId,
            claimedBy: userId,
            status: {
                $nin: ["rejected", "completed"],
            },
        });

        if (existingClaim) {
            return res.status(409).json({
                message: "You already have an active claim for this item.",
            });
        }

        const files = (req.files as Express.Multer.File[]) || [];

        uploadedEvidence = await uploadEvidence(files);

        const claim = await Claim.create({
            foundItem: foundItemId,
            claimedBy: userId,
            explanation: String(explanation).trim(),
            ownershipEvidence: uploadedEvidence,
            status: "pending",
        });

        const admins = await User.find({ role: "admin" }).select("_id");

        await Promise.all(
            admins.map((admin) =>
                sendNotification(
                    admin._id.toString(),
                    "New Claim Request",
                    `A student has submitted a claim for "${foundItem.name}".`,
                    claim._id.toString()
                )
            )
        );

        return res.status(201).json({
            message: "Claim request submitted successfully. Waiting for admin review.",
            claim,
        });
    } catch (error) {
        await deleteEvidence(uploadedEvidence);

        console.error("Create claim error:", error);

        return res.status(500).json({
            message: "Failed to submit claim request.",
        });
    }
};

// USER: View own claims
export const getMyClaims = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }

        const claims = await Claim.find({
            claimedBy: userId,
        })
            .populate("foundItem")
            .sort({ createdAt: -1 });

        return res.status(200).json({ claims });
    } catch (error) {
        console.error("Get my claims error:", error);

        return res.status(500).json({
            message: "Failed to retrieve your claims.",
        });
    }
};

// USER or ADMIN: View a claim and its conversation
export const getClaimById = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                message: "Invalid claim ID.",
            });
        }

        const claim = await Claim.findById(id)
            .populate("foundItem")
            .populate("claimedBy", "fullName email studentId")
            .populate("reviewedBy", "fullName email")
            .populate("verificationMessages.sender", "fullName email");

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found.",
            });
        }

        if (
            !isAdmin(req) &&
            claim.claimedBy._id.toString() !== userId
        ) {
            return res.status(403).json({
                message: "You are not allowed to view this claim.",
            });
        }

        return res.status(200).json({ claim });
    } catch (error) {
        console.error("Get claim error:", error);

        return res.status(500).json({
            message: "Failed to retrieve claim.",
        });
    }
};

// USER: Reply to admin with additional information/evidence
export const replyToClaim = async (
    req: AuthRequest,
    res: Response
) => {
    let uploadedEvidence: { url: string; publicId: string }[] = [];

    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const { message } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                message: "Invalid claim ID.",
            });
        }

        const claim = await Claim.findById(id);

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found.",
            });
        }

        if (claim.claimedBy.toString() !== userId) {
            return res.status(403).json({
                message: "Only the claimant can reply.",
            });
        }

        if (
            !["verification_requested", "response_submitted"].includes(
                claim.status
            )
        ) {
            return res.status(400).json({
                message: "You can reply only when additional verification has been requested.",
            });
        }

        const files = (req.files as Express.Multer.File[]) || [];

        if (!message?.trim() && files.length === 0) {
            return res.status(400).json({
                message: "Please provide a message or supporting evidence.",
            });
        }

        uploadedEvidence = await uploadEvidence(files);

        claim.verificationMessages.push({
            sender: new mongoose.Types.ObjectId(userId),
            senderRole: "user",
            message: message?.trim() || "Additional evidence submitted.",
            attachments: uploadedEvidence,
            createdAt: new Date(),
        });

        claim.status = "response_submitted";
        claim.lastResponseAt = new Date();

        await claim.save();

        const admins = await User.find({ role: "admin" }).select("_id");

        await Promise.all(
            admins.map((admin) =>
                sendNotification(
                    admin._id.toString(),
                    "Claim Verification Response",
                    "A claimant has submitted additional verification information.",
                    claim._id.toString()
                )
            )
        );

        return res.status(200).json({
            message: "Your verification response was submitted successfully.",
            claim,
        });
    } catch (error) {
        await deleteEvidence(uploadedEvidence);

        console.error("Reply to claim error:", error);

        return res.status(500).json({
            message: "Failed to submit verification response.",
        });
    }
};

// ADMIN: View all claim requests
export const getAllClaims = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        const claims = await Claim.find()
            .populate("foundItem")
            .populate("claimedBy", "fullName email studentId")
            .populate("reviewedBy", "fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ claims });
    } catch (error) {
        console.error("Get all claims error:", error);

        return res.status(500).json({
            message: "Failed to retrieve claim requests.",
        });
    }
};

// ADMIN: Request more ownership verification
export const requestClaimVerification = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;
        const { message } = req.body;

        if (!isAdmin(req) || !adminId) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        if (!message?.trim()) {
            return res.status(400).json({
                message: "Please explain what additional evidence is required.",
            });
        }

        const claim = await Claim.findById(id);

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found.",
            });
        }

        if (
            !["pending", "response_submitted"].includes(claim.status)
        ) {
            return res.status(400).json({
                message: "Additional verification cannot be requested at this stage.",
            });
        }

        claim.verificationMessages.push({
            sender: new mongoose.Types.ObjectId(adminId),
            senderRole: "admin",
            message: message.trim(),
            attachments: [],
            createdAt: new Date(),
        });

        claim.status = "verification_requested";
        claim.verificationRequestedAt = new Date();

        await claim.save();

        await sendNotification(
            claim.claimedBy.toString(),
            "Additional Verification Required",
            message.trim(),
            claim._id.toString()
        );

        return res.status(200).json({
            message: "Additional verification requested successfully.",
            claim,
        });
    } catch (error) {
        console.error("Request claim verification error:", error);

        return res.status(500).json({
            message: "Failed to request additional verification.",
        });
    }
};

// ADMIN: Approve a claim
export const approveClaim = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;

        if (!isAdmin(req) || !adminId) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        const claim = await Claim.findById(id);

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found.",
            });
        }

        if (
            !["pending", "response_submitted"].includes(claim.status)
        ) {
            return res.status(400).json({
                message: "This claim cannot be approved at its current stage.",
            });
        }

        const foundItem = await FoundItem.findOne({
            _id: claim.foundItem,
            approvalStatus: "approved",
            status: "available",
        });

        if (!foundItem) {
            return res.status(409).json({
                message: "This found item is no longer available.",
            });
        }

        // Prevent two different claims from being approved for the same item.
        const otherApprovedClaim = await Claim.findOne({
            foundItem: claim.foundItem,
            _id: { $ne: claim._id },
            status: { $in: ["approved", "completed"] },
        });

        if (otherApprovedClaim) {
            return res.status(409).json({
                message: "Another claim has already been approved for this item.",
            });
        }

        claim.status = "approved";
        claim.reviewedBy = new mongoose.Types.ObjectId(adminId);
        claim.reviewedAt = new Date();

        foundItem.status = "claimed";

        await claim.save();
        await foundItem.save();

        await sendNotification(
            claim.claimedBy.toString(),
            "Claim Approved",
            `Your claim for "${foundItem.name}" has been approved. Please follow the handover instructions from the university.`,
            claim._id.toString()
        );

        await sendNotification(
            foundItem.reportedBy.toString(),
            "Claim Approved",
            `A claim for your found item "${foundItem.name}" has been approved. Please coordinate with the university for the handover.`,
            claim._id.toString()
        );

        return res.status(200).json({
            message: "Claim approved successfully. Physical handover is still required.",
            claim,
        });
    } catch (error) {
        console.error("Approve claim error:", error);

        return res.status(500).json({
            message: "Failed to approve claim.",
        });
    }
};

// ADMIN: Reject a claim
export const rejectClaim = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;
        const { reason } = req.body;

        if (!isAdmin(req) || !adminId) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        if (!reason?.trim()) {
            return res.status(400).json({
                message: "Please provide a rejection reason.",
            });
        }

        const claim = await Claim.findById(id);

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found.",
            });
        }

        if (
            !["pending", "verification_requested", "response_submitted"].includes(
                claim.status
            )
        ) {
            return res.status(400).json({
                message: "This claim cannot be rejected at its current stage.",
            });
        }

        claim.status = "rejected";
        claim.rejectionReason = reason.trim();
        claim.reviewedBy = new mongoose.Types.ObjectId(adminId);
        claim.reviewedAt = new Date();

        await claim.save();

        await sendNotification(
            claim.claimedBy.toString(),
            "Claim Request Rejected",
            `Your claim was rejected. Reason: ${reason.trim()}`,
            claim._id.toString()
        );

        return res.status(200).json({
            message: "Claim rejected successfully.",
            claim,
        });
    } catch (error) {
        console.error("Reject claim error:", error);

        return res.status(500).json({
            message: "Failed to reject claim.",
        });
    }
};

// ADMIN: Confirm physical handover
export const completeClaim = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;
        const { returnNotes } = req.body;

        if (!isAdmin(req) || !adminId) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        const claim = await Claim.findById(id);

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found.",
            });
        }

        if (claim.status !== "approved") {
            return res.status(400).json({
                message: "Only an approved claim can be completed.",
            });
        }

        const foundItem = await FoundItem.findOne({
            _id: claim.foundItem,
            status: "claimed",
            approvalStatus: "approved",
        });

        if (!foundItem) {
            return res.status(409).json({
                message: "The found item is not in the expected handover state.",
            });
        }

        // The verified claimant is the only person who can receive the item.
        foundItem.status = "returned";
        foundItem.returnedTo = claim.claimedBy;
        foundItem.returnedBy = new mongoose.Types.ObjectId(adminId);
        foundItem.returnedAt = new Date();
        foundItem.returnNotes = returnNotes;

        claim.status = "completed";
        claim.completedBy = new mongoose.Types.ObjectId(adminId);
        claim.completedAt = new Date();
        claim.returnNotes = returnNotes;

        await foundItem.save();
        await claim.save();

        await sendNotification(
            claim.claimedBy.toString(),
            "Item Handover Completed",
            `The item "${foundItem.name}" has been handed over to you successfully.`,
            claim._id.toString()
        );

        await sendNotification(
            foundItem.reportedBy.toString(),
            "Item Returned",
            `The found item "${foundItem.name}" has been successfully returned to its owner.`,
            claim._id.toString()
        );

        return res.status(200).json({
            message: "Claim completed and item handover confirmed.",
            claim,
            foundItem,
        });
    } catch (error) {
        console.error("Complete claim error:", error);

        return res.status(500).json({
            message: "Failed to complete claim.",
        });
    }
};
