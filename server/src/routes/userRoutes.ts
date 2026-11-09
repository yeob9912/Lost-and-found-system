
import { Router } from "express";

import {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    deleteMyAccount,
} from "../controllers/user.controller";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// All student profile routes require authentication
router.use(protect);

// GET /api/users/profile
router.get("/profile", getMyProfile);

// PATCH /api/users/profile
router.patch("/profile", updateMyProfile);

// PATCH /api/users/change-password
router.patch("/change-password", changeMyPassword);

// DELETE /api/users/profile
router.delete("/profile", deleteMyAccount);

export default router;
