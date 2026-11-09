import mongoose from "mongoose";
import LostItem, { ILostItem } from "../models/LostItem";
import cloudinary from "../config/cloudinary";

export type LostItemStatus =
    | "lost"
    | "match_found"
    | "returned";

export type ApprovalStatus =
    | "pending"
    | "approved"
    | "rejected";

export interface LostItem {
    _id: string;
    name: string;
    category: string;
    brand?: string;
    color?: string;
    location: string;
    date: string;
    description: string;
    image: string;
    imagePublicId: string;
    status: LostItemStatus;
    approvalStatus: ApprovalStatus;
    rejectionReason?: string;
    reportedBy:
        | string
        | {
            _id: string;
            fullName?: string;
            name?: string;
            email?: string;
        };
    reviewedBy?: string;
    reviewedAt?: string;
    returnedTo?: string;
    returnedBy?: string;
    returnedAt?: string;
    returnNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLostItemData {
    name: string;
    category: string;
    brand?: string;
    color?: string;
    location: string;
    date: string | Date;
    description: string;
    image: string;
    imagePublicId?: string;
    reportedBy?: string | mongoose.Types.ObjectId;
}

export interface UpdateLostItemData {
    name?: string;
    category?: string;
    brand?: string;
    color?: string;
    location?: string;
    date?: string | Date;
    description?: string;
    image?: string;
    imagePublicId?: string;
    status?: LostItemStatus;
    approvalStatus?: ApprovalStatus;
}

export interface LostItemFilters {
    search?: string;
    category?: string;
    status?: LostItemStatus;
    location?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedLostItems {
    success: boolean;
    count: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    data: any[];
}

// 1. SUBMIT LOST ITEM REPORT
export const createLostItem = async (
    data: CreateLostItemData,
    userId?: string
): Promise<ILostItem> => {
    const item = await LostItem.create({
        name: data.name,
        category: data.category,
        brand: data.brand,
        color: data.color,
        location: data.location,
        date: new Date(data.date),
        description: data.description,
        image: data.image,
        imagePublicId: data.imagePublicId || "external_ref",
        reportedBy: userId || data.reportedBy,
        approvalStatus: "pending",
        status: "lost",
    });

    return item;
};

// 2. GET APPROVED PUBLIC LOST ITEMS
export const getLostItems = async (
    filters: LostItemFilters = {}
): Promise<PaginatedLostItems> => {
    const pageNumber = Math.max(1, Number(filters.page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(filters.limit) || 12));

    const filter: Record<string, any> = {
        approvalStatus: "approved",
    };

    if (filters.status) {
        filter.status = filters.status;
    } else {
        filter.status = { $in: ["lost", "match_found"] };
    }

    if (filters.category) {
        filter.category = filters.category.trim().toLowerCase();
    }

    if (filters.search && filters.search.trim()) {
        filter.$text = { $search: filters.search.trim() };
    }

    if (filters.location && filters.location.trim()) {
        const escaped = filters.location.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.location = { $regex: escaped, $options: "i" };
    }

    const totalItems = await LostItem.countDocuments(filter);
    const items = await LostItem.find(filter)
        .populate("reportedBy", "fullName email studentId")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    return {
        success: true,
        count: items.length,
        totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
        data: items,
    };
};

// 3. GET SINGLE PUBLIC LOST ITEM
export const getLostItemById = async (
    id: string
): Promise<ILostItem | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await LostItem.findOne({
        _id: id,
        approvalStatus: "approved",
    }).populate("reportedBy", "fullName email studentId");

    return item;
};

// 4. GET MY LOST ITEM REPORTS
export const getMyLostItems = async (
    userId: string
): Promise<ILostItem[]> => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Authentication required");
    }

    const items = await LostItem.find({
        reportedBy: userId,
    }).sort({ createdAt: -1 });

    return items;
};

// 5. UPDATE MY LOST ITEM REPORT
export const updateLostItem = async (
    id: string,
    data: UpdateLostItemData,
    userId?: string
): Promise<ILostItem | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const query: Record<string, any> = { _id: id };
    if (userId) {
        query.reportedBy = userId;
    }

    const item = await LostItem.findOneAndUpdate(
        query,
        { $set: data },
        { new: true, runValidators: true }
    );

    return item;
};

// 6. DELETE MY LOST ITEM REPORT
export const deleteLostItem = async (
    id: string,
    userId?: string
): Promise<boolean> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const query: Record<string, any> = { _id: id };
    if (userId) {
        query.reportedBy = userId;
    }

    const item = await LostItem.findOne(query);
    if (!item) {
        return false;
    }

    if (item.imagePublicId && item.imagePublicId !== "external_ref") {
        try {
            await cloudinary.uploader.destroy(item.imagePublicId);
        } catch (err) {
            console.error("Cloudinary image deletion failed:", err);
        }
    }

    await LostItem.deleteOne({ _id: id });
    return true;
};

// 7. ADMIN: GET ALL REPORTS
export const getAllLostItemReports = async (
    approvalStatus?: ApprovalStatus,
    page = 1,
    limit = 20
): Promise<PaginatedLostItems> => {
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 20));

    const filter: Record<string, any> = {};
    if (approvalStatus) {
        filter.approvalStatus = approvalStatus;
    }

    const totalItems = await LostItem.countDocuments(filter);
    const items = await LostItem.find(filter)
        .populate("reportedBy", "fullName email studentId")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    return {
        success: true,
        count: items.length,
        totalItems,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalItems / limitNumber),
        data: items,
    };
};

// 8. ADMIN: APPROVE REPORT
export const approveLostItem = async (
    id: string,
    reviewerId?: string
): Promise<ILostItem | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await LostItem.findByIdAndUpdate(
        id,
        {
            $set: {
                approvalStatus: "approved",
                reviewedBy: reviewerId,
                reviewedAt: new Date(),
            },
        },
        { new: true }
    );

    return item;
};

// 9. ADMIN: REJECT REPORT
export const rejectLostItem = async (
    id: string,
    reason: string,
    reviewerId?: string
): Promise<ILostItem | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await LostItem.findByIdAndUpdate(
        id,
        {
            $set: {
                approvalStatus: "rejected",
                rejectionReason: reason,
                reviewedBy: reviewerId,
                reviewedAt: new Date(),
            },
        },
        { new: true }
    );

    return item;
};

// 10. ADMIN: CONFIRM ITEM RETURN
export const confirmLostItemReturn = async (
    id: string,
    returnedTo: string,
    returnNotes?: string,
    adminId?: string
): Promise<ILostItem | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await LostItem.findByIdAndUpdate(
        id,
        {
            $set: {
                status: "returned",
                returnedTo,
                returnNotes,
                returnedBy: adminId,
                returnedAt: new Date(),
            },
        },
        { new: true }
    );

    return item;
};
