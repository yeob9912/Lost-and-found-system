
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import lostItemRoutes from "./routes/lostItemRoutes";
import foundItemRoutes from "./routes/foundItemRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import adminRoutes from "./routes/adminRoutes";

import claimRoutes from "./routes/claimRoutes";


const app = express();

// CORS configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Global middleware (50mb limit supports base64 profile image uploads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "FindBack API is running successfully.",
    });
});

// Handle unknown routes
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});

export default app;
