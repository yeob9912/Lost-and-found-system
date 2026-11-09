
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

import { protect } from "../middleware/authMiddleware";
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
router.get("/admin/all", protect, getAllClaims);

router.patch(
    "/admin/:id/request-verification",
    protect,
    requestClaimVerification
);

router.patch("/admin/:id/approve", protect, approveClaim);
router.patch("/admin/:id/reject", protect, rejectClaim);
router.patch("/admin/:id/complete", protect, completeClaim);

export default router;
