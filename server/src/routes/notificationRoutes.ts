
import { Router } from "express";

import {
    getMyNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications,
} from "../controllers/notificationController";

// Replace this import with your actual authentication middleware.
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);

router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:id/read", markNotificationAsRead);

router.delete("/", deleteAllNotifications);
router.delete("/:id", deleteNotification);

export default router;
