
import { Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// GET LOGGED-IN STUDENT PROFILE
export const getMyProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication.",
            });
            return;
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Student profile not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                studentId: user.studentId,
                email: user.email,
                phone: user.phone || "",
                department: user.department || "",
                yearOfStudy: user.yearOfStudy || "",
                role: user.role,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve profile.",
        });
    }
};

// UPDATE STUDENT PROFILE
export const updateMyProfile = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication.",
            });
            return;
        }

        const {
            fullName,
            email,
            phone,
            department,
            yearOfStudy,
            profileImage,
        } = req.body;

        if (
            fullName === undefined &&
            email === undefined &&
            phone === undefined &&
            department === undefined &&
            yearOfStudy === undefined &&
            profileImage === undefined
        ) {
            res.status(400).json({
                success: false,
                message: "Provide at least one field to update.",
            });
            return;
        }

        const updates: {
            fullName?: string;
            email?: string;
            phone?: string;
            department?: string;
            yearOfStudy?: string;
            profileImage?: string;
        } = {};

        if (fullName !== undefined) {
            if (typeof fullName !== "string" || fullName.trim().length < 2) {
                res.status(400).json({
                    success: false,
                    message: "Full name must contain at least 2 characters.",
                });
                return;
            }

            updates.fullName = fullName.trim();
        }

        if (email !== undefined) {
            if (
                typeof email !== "string" ||
                !/^\S+@\S+\.\S+$/.test(email.trim())
            ) {
                res.status(400).json({
                    success: false,
                    message: "Please provide a valid email address.",
                });
                return;
            }

            updates.email = email.trim().toLowerCase();
        }

        if (phone !== undefined) {
            updates.phone = typeof phone === "string" ? phone.trim() : "";
        }

        if (department !== undefined) {
            updates.department =
                typeof department === "string" ? department.trim() : "";
        }

        if (yearOfStudy !== undefined) {
            updates.yearOfStudy =
                typeof yearOfStudy === "string" ? yearOfStudy.trim() : "";
        }

        if (profileImage !== undefined) {
            updates.profileImage =
                typeof profileImage === "string" ? profileImage : "";
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Student profile not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                id: user._id,
                fullName: user.fullName,
                studentId: user.studentId,
                email: user.email,
                phone: user.phone || "",
                department: user.department || "",
                yearOfStudy: user.yearOfStudy || "",
                role: user.role,
                profileImage: user.profileImage,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error: unknown) {
        console.error("Update profile error:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            res.status(409).json({
                success: false,
                message: "This email address is already registered.",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Failed to update profile.",
        });
    }
};

// CHANGE STUDENT PASSWORD
export const changeMyPassword = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication.",
            });
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            res.status(400).json({
                success: false,
                message: "All password fields are required.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({
                success: false,
                message: "New password and confirmation do not match.",
            });
            return;
        }

        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!strongPasswordRegex.test(newPassword)) {
            res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase, number and special character, with at least 8 characters.",
            });
            return;
        }

        const user = await User.findById(userId).select("+password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Student account not found.",
            });
            return;
        }

        const isPasswordCorrect = await user.comparePassword(currentPassword);

        if (!isPasswordCorrect) {
            res.status(400).json({
                success: false,
                message: "Your current password is incorrect.",
            });
            return;
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to change password.",
        });
    }
};

// DELETE STUDENT ACCOUNT
export const deleteMyAccount = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({
                success: false,
                message: "Invalid authentication.",
            });
            return;
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Student account not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Account deleted successfully.",
        });
    } catch (error) {
        console.error("Delete account error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete account.",
        });
    }
};

