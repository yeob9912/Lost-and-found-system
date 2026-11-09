import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getAllUsers, updateUserRole, deleteUser, getAdminStats } from "../controllers/adminController";

const router = Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get("/stats", getAdminStats);

// User management
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;

