
import { Request, Response } from "express";
import mongoose from "mongoose";
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

const getUserId = (req: AuthRequest): string | undefined => {
    return req.user?.userId || req.user?.id || req.user?._id;
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
            user: userId,
            title,
            message,
            type: "found_item",
            relatedId,
            isRead: false,
        });
    } catch (error) {
        console.error("Notification error:", error);
    }
};

const uploadImage = async (file: Express.Multer.File) => {
    return new Promise<{ url: string; publicId: string }>(
        (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "astu-lost-and-found/found-items",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error || new Error("Image upload failed"));
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );

            uploadStream.end(file.buffer);
        }
    );
};

const deleteCloudinaryImage = async (publicId?: string) => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
    }
};

// STUDENT/STAFF: Submit a found-item report
export const createFoundItem = async (
    req: AuthRequest,
    res: Response
) => {
    let uploadedPublicId: string | undefined;

    try {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }

        const name = req.body.name;
        const category = req.body.category;
        const brand = req.body.brand;
        const color = req.body.color;
        const foundLocation = req.body.foundLocation || req.body.location;
        const foundDate = req.body.foundDate || req.body.date;
        const description = req.body.description;

        if (
            !name ||
            !category ||
            !foundLocation ||
            !foundDate ||
            !description
        ) {
            return res.status(400).json({
                message: "Please provide all required found-item information.",
            });
        }

        let imageUrl = "";
        let publicId = "";

        if (req.file) {
            const uploaded = await uploadImage(req.file);
            uploadedPublicId = uploaded.publicId;
            imageUrl = uploaded.url;
            publicId = uploaded.publicId;
        } else if (req.body.image) {
            imageUrl = req.body.image;
            publicId = "external_ref";
        } else {
            return res.status(400).json({
                message: "An item image is required.",
            });
        }

        const foundItem = await FoundItem.create({
            name,
            category,
            brand,
            color,
            foundLocation,
            foundDate,
            description,
            image: imageUrl,
            imagePublicId: publicId,
            reportedBy: userId,
            status: "available",
            approvalStatus: "pending",
        });

        // Notify administrators about the new report.
        const admins = await User.find({ role: "admin" }).select("_id");

        await Promise.all(
            admins.map((admin) =>
                sendNotification(
                    admin._id.toString(),
                    "New Found Item Report",
                    `A new found-item report "${name}" requires your review.`,
                    foundItem._id.toString()
                )
            )
        );

        return res.status(201).json({
            message: "Found-item report submitted successfully. Waiting for admin approval.",
            foundItem,
        });
    } catch (error) {
        if (uploadedPublicId) {
            await deleteCloudinaryImage(uploadedPublicId);
        }

        console.error("Create found item error:", error);

        return res.status(500).json({
            message: "Failed to submit found-item report.",
        });
    }
};

// PUBLIC: Get approved found items
export const getFoundItems = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            search,
            category,
            location,
            page = "1",
            limit = "12",
        } = req.query;

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 50);

        const filter: Record<string, any> = {
            approvalStatus: "approved",
            status: { $in: ["available", "claimed"] },
        };

        if (category) {
            filter.category = category;
        }

        if (location) {
            filter.foundLocation = {
                $regex: String(location),
                $options: "i",
            };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: String(search), $options: "i" } },
                { description: { $regex: String(search), $options: "i" } },
                { brand: { $regex: String(search), $options: "i" } },
            ];
        }

        const [items, total] = await Promise.all([
            FoundItem.find(filter)
                .populate("reportedBy", "fullName email studentId")
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber),

            FoundItem.countDocuments(filter),
        ]);

        return res.status(200).json({
            items,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error("Get found items error:", error);

        return res.status(500).json({
            message: "Failed to retrieve found items.",
        });
    }
};

// PUBLIC: Get one approved found item
export const getFoundItemById = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                message: "Invalid found-item ID.",
            });
        }

        const foundItem = await FoundItem.findOne({
            _id: id,
            approvalStatus: "approved",
        }).populate("reportedBy", "fullName email studentId");

        if (!foundItem) {
            return res.status(404).json({
                message: "Found item not found.",
            });
        }

        return res.status(200).json({ foundItem });
    } catch (error) {
        console.error("Get found item error:", error);

        return res.status(500).json({
            message: "Failed to retrieve found item.",
        });
    }
};

// AUTHENTICATED USER: Get own reports
export const getMyFoundItems = async (
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

        const items = await FoundItem.find({
            reportedBy: userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({ items });
    } catch (error) {
        console.error("Get my found items error:", error);

        return res.status(500).json({
            message: "Failed to retrieve your found-item reports.",
        });
    }
};

// OWNER: Update a pending or rejected report
export const updateFoundItem = async (
    req: AuthRequest,
    res: Response
) => {
    let uploadedPublicId: string | undefined;

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
                message: "Invalid found-item ID.",
            });
        }

        const item = await FoundItem.findOne({
            _id: id,
            reportedBy: userId,
        });

        if (!item) {
            return res.status(404).json({
                message: "Found item not found.",
            });
        }

        if (
            item.approvalStatus === "approved" ||
            item.status !== "available"
        ) {
            return res.status(400).json({
                message: "Only pending or rejected reports can be edited.",
            });
        }

        const allowedFields = [
            "name",
            "category",
            "brand",
            "color",
            "foundLocation",
            "foundDate",
            "description",
        ] as const;

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                (item as any)[field] = req.body[field];
            }
        }

        if (req.file) {
            const uploaded = await uploadImage(req.file);
            uploadedPublicId = uploaded.publicId;

            const oldPublicId = item.imagePublicId;

            item.image = uploaded.url;
            item.imagePublicId = uploaded.publicId;

            await item.save();
            await deleteCloudinaryImage(oldPublicId);

            return res.status(200).json({
                message: "Found-item report updated successfully.",
                foundItem: item,
            });
        }

        item.approvalStatus = "pending";
        item.rejectionReason = undefined;
        item.reviewedBy = undefined;
        item.reviewedAt = undefined;

        await item.save();

        return res.status(200).json({
            message: "Found-item report updated and resubmitted for approval.",
            foundItem: item,
        });
    } catch (error) {
        if (uploadedPublicId) {
            await deleteCloudinaryImage(uploadedPublicId);
        }

        console.error("Update found item error:", error);

        return res.status(500).json({
            message: "Failed to update found-item report.",
        });
    }
};

// OWNER OR ADMIN: Delete a report
export const deleteFoundItem = async (
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
                message: "Invalid found-item ID.",
            });
        }

        const item = await FoundItem.findById(id);

        if (!item) {
            return res.status(404).json({
                message: "Found item not found.",
            });
        }

        const isOwner = item.reportedBy.toString() === userId;

        if (!isOwner && !isAdmin(req)) {
            return res.status(403).json({
                message: "You are not allowed to delete this report.",
            });
        }

        if (item.status === "returned") {
            return res.status(400).json({
                message: "A returned item cannot be deleted.",
            });
        }

        await deleteCloudinaryImage(item.imagePublicId);
        await item.deleteOne();

        return res.status(200).json({
            message: "Found-item report deleted successfully.",
        });
    } catch (error) {
        console.error("Delete found item error:", error);

        return res.status(500).json({
            message: "Failed to delete found-item report.",
        });
    }
};

// ADMIN: View all found-item reports
export const getAllFoundItemReports = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        const items = await FoundItem.find()
            .populate("reportedBy", "fullName email studentId")
            .populate("reviewedBy", "fullName email")
            .populate("returnedTo", "fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ items });
    } catch (error) {
        console.error("Admin found-item reports error:", error);

        return res.status(500).json({
            message: "Failed to retrieve found-item reports.",
        });
    }
};

// ADMIN: Approve a found-item report
export const approveFoundItem = async (
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

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                message: "Invalid found-item ID.",
            });
        }

        const item = await FoundItem.findById(id);

        if (!item) {
            return res.status(404).json({
                message: "Found item not found.",
            });
        }

        if (item.approvalStatus !== "pending") {
            return res.status(400).json({
                message: "Only pending reports can be approved.",
            });
        }

        item.approvalStatus = "approved";
        item.status = "available";
        item.reviewedBy = new mongoose.Types.ObjectId(adminId);
        item.reviewedAt = new Date();
        item.rejectionReason = undefined;

        await item.save();

        await sendNotification(
            item.reportedBy.toString(),
            "Found Item Approved",
            `Your found-item report "${item.name}" has been approved and is now visible.`,
            item._id.toString()
        );

        return res.status(200).json({
            message: "Found-item report approved successfully.",
            foundItem: item,
        });
    } catch (error) {
        console.error("Approve found item error:", error);

        return res.status(500).json({
            message: "Failed to approve found-item report.",
        });
    }
};

// ADMIN: Reject a found-item report
export const rejectFoundItem = async (
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

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                message: "Invalid found-item ID.",
            });
        }

        if (!reason || !String(reason).trim()) {
            return res.status(400).json({
                message: "Please provide a rejection reason.",
            });
        }

        const item = await FoundItem.findById(id);

        if (!item) {
            return res.status(404).json({
                message: "Found item not found.",
            });
        }

        if (item.approvalStatus !== "pending") {
            return res.status(400).json({
                message: "Only pending reports can be rejected.",
            });
        }

        item.approvalStatus = "rejected";
        item.rejectionReason = String(reason).trim();
        item.reviewedBy = new mongoose.Types.ObjectId(adminId);
        item.reviewedAt = new Date();

        await item.save();

        await sendNotification(
            item.reportedBy.toString(),
            "Found Item Report Rejected",
            `Your report "${item.name}" was rejected. Reason: ${item.rejectionReason}`,
            item._id.toString()
        );

        return res.status(200).json({
            message: "Found-item report rejected successfully.",
            foundItem: item,
        });
    } catch (error) {
        console.error("Reject found item error:", error);

        return res.status(500).json({
            message: "Failed to reject found-item report.",
        });
    }
};

// ADMIN: Confirm physical handover after claim verification
export const confirmFoundItemReturn = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const adminId = getUserId(req);
        const { id } = req.params;
        const { returnedTo, returnNotes } = req.body;

        if (!isAdmin(req) || !adminId) {
            return res.status(403).json({
                message: "Admin access required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id as string)) {
            return res.status(400).json({
                message: "Invalid found-item ID.",
            });
        }

        if (!returnedTo || !mongoose.Types.ObjectId.isValid(returnedTo)) {
            return res.status(400).json({
                message: "A valid verified owner's user ID is required.",
            });
        }

        const item = await FoundItem.findById(id);

        if (!item) {
            return res.status(404).json({
                message: "Found item not found.",
            });
        }

        if (
            item.approvalStatus !== "approved" ||
            item.status !== "claimed"
        ) {
            return res.status(400).json({
                message: "The item must be approved and have an approved claim before handover.",
            });
        }

        item.status = "returned";
        item.returnedTo = new mongoose.Types.ObjectId(returnedTo);
        item.returnedBy = new mongoose.Types.ObjectId(adminId);
        item.returnedAt = new Date();
        item.returnNotes = returnNotes;

        await item.save();

        await sendNotification(
            returnedTo,
            "Item Returned",
            `The found item "${item.name}" has been handed over to you.`,
            item._id.toString()
        );

        await sendNotification(
            item.reportedBy.toString(),
            "Item Handover Completed",
            `The found item "${item.name}" has been successfully handed over.`,
            item._id.toString()
        );

        return res.status(200).json({
            message: "Item handover confirmed successfully.",
            foundItem: item,
        });
    } catch (error) {
        console.error("Confirm found item return error:", error);

        return res.status(500).json({
            message: "Failed to confirm item handover.",
        });
    }
};
