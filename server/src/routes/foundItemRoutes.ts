
import { Router } from "express";

import {
    createFoundItem,
    getFoundItems,
    getFoundItemById,
    getMyFoundItems,
    updateFoundItem,
    deleteFoundItem,
    getAllFoundItemReports,
    approveFoundItem,
    rejectFoundItem,
    confirmFoundItemReturn,
} from "../controllers/foundItemController";

import { protect, adminOnly } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

// Public routes
router.get("/", getFoundItems);

// User routes
router.get("/my-items", protect, getMyFoundItems);
router.post("/", protect, upload.single("image"), createFoundItem);
router.put("/:id", protect, upload.single("image"), updateFoundItem);
router.delete("/:id", protect, deleteFoundItem);

// Admin routes
router.get("/admin/reports", protect, adminOnly, getAllFoundItemReports);
router.patch("/admin/:id/approve", protect, adminOnly, approveFoundItem);
router.patch("/admin/:id/reject", protect, adminOnly, rejectFoundItem);
router.patch(
    "/admin/:id/confirm-return",
    protect,
    adminOnly,
    confirmFoundItemReturn
);

// Keep this dynamic route last
router.get("/:id", getFoundItemById);

export default router;
