
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

import { protect, adminOnly, studentOnly } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

// Public routes
router.get("/", getFoundItems);

// Student routes (Admins manage found items via admin routes)
router.get("/my-items", protect, studentOnly, getMyFoundItems);
router.post("/", protect, studentOnly, upload.single("image"), createFoundItem);
router.put("/:id", protect, studentOnly, upload.single("image"), updateFoundItem);
router.delete("/:id", protect, studentOnly, deleteFoundItem);

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
