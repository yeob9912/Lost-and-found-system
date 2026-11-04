import { Router } from "express";
import { register, login } from "../controllers/authController";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req: AuthRequest, res) => {
    res.status(200).json({
        message: "You are authenticated.",
        user: req.user,
    });
});

export default router;