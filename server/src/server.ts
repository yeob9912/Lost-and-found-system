import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware
app.use(express.json());

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
