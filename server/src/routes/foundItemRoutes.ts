
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

import { protect } from "../middleware/authMiddleware";
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
router.get("/admin/reports", protect, getAllFoundItemReports);
router.patch("/admin/:id/approve", protect, approveFoundItem);
router.patch("/admin/:id/reject", protect, rejectFoundItem);
router.patch(
    "/admin/:id/confirm-return",
    protect,
    confirmFoundItemReturn
);

// Keep this dynamic route last
router.get("/:id", getFoundItemById);

export default router;
