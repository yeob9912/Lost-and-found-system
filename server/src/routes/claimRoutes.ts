
import { Router } from "express";

import {
    createClaim,
    getMyClaims,
    getClaimById,
    replyToClaim,
    getAllClaims,
    requestClaimVerification,
    approveClaim,
    rejectClaim,
    completeClaim,
} from "../controllers/claimController";

import { protect, adminOnly } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

// User routes
router.post("/", protect, upload.array("evidence", 5), createClaim);
router.get("/my-claims", protect, getMyClaims);
router.get("/:id", protect, getClaimById);

// User replies with additional verification evidence
router.post(
    "/:id/messages",
    protect,
    upload.array("evidence", 5),
    replyToClaim
);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllClaims);

router.patch(
    "/admin/:id/request-verification",
    protect,
    adminOnly,
    requestClaimVerification
);

router.patch("/admin/:id/approve", protect, adminOnly, approveClaim);
router.patch("/admin/:id/reject", protect, adminOnly, rejectClaim);
router.patch("/admin/:id/complete", protect, adminOnly, completeClaim);

export default router;
