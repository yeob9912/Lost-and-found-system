import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware
app.use(express.json());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Authentication routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "FindBack API is running successfully",
    });
});

// Connect MongoDB and start server
const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`FindBack server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();