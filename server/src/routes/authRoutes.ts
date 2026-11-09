import { Router } from "express";
import { register, login } from "../controllers/authController";
import { protect, AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.user?.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({
            message: "You are authenticated.",
            user: {
                id: user._id,
                fullName: user.fullName,
                studentId: user.studentId,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage || "",
                phone: user.phone || "",
                department: user.department || "",
                yearOfStudy: user.yearOfStudy || "",
            },
        });
    } catch {
        return res.status(500).json({ message: "Failed to retrieve user." });
    }
});

export default router;