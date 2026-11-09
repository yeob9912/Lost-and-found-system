
import { Router } from "express";

import {
    createLostItem,
    getLostItems,
    getLostItemById,
    getMyLostItems,
    updateLostItem,
    deleteLostItem,
    getAllLostItemReports,
    approveLostItem,
    rejectLostItem,
    confirmLostItemReturn,
} from "../controllers/lostItemController";

import upload from "../middleware/uploadMiddleware";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

// PUBLIC ROUTES

// Get approved Lost Items
router.get("/", getLostItems);

// AUTHENTICATED USER ROUTES

// Important: Put /my-items before /:id
router.get("/my-items", protect, getMyLostItems);

// Submit a new Lost Item report
router.post(
    "/",
    protect,
    upload.single("image"),
    createLostItem
);

// Update own report
router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateLostItem
);

// Delete own report
router.delete("/:id", protect, deleteLostItem);

// ADMIN ROUTES

// Get all reports, including pending and rejected
router.get(
    "/admin/reports",
    protect,
    adminOnly,
    getAllLostItemReports
);

// Approve a report
router.patch(
    "/admin/:id/approve",
    protect,
    adminOnly,
    approveLostItem
);

// Reject a report
router.patch(
    "/admin/:id/reject",
    protect,
    adminOnly,
    rejectLostItem
);

// Confirm successful return
router.patch(
    "/admin/:id/confirm-return",
    protect,
    adminOnly,
    confirmLostItemReturn
);

// Get one approved public item
router.get("/:id", getLostItemById);

export default router;
