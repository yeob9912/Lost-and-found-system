import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const studentIdRegex = /^UGR\/[0-9]{5}\/[0-9]{2}$/;

const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const generateToken = (userId: string, role: string) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );
};

// REGISTER
export const register = async (req: Request, res: Response) => {
    try {
        const {
            fullName,
            studentId,
            email,
            password,
            confirmPassword,
            agreeTerms,
        } = req.body;

        // Check required fields
        if (
            !fullName ||
            !studentId ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        // Terms agreement is mandatory
        if (agreeTerms !== true) {
            return res.status(400).json({
                message: "You must agree to the Terms and Conditions.",
            });
        }

        // Validate student ID
        if (!studentIdRegex.test(studentId.trim())) {
            return res.status(400).json({
                message: "Incorrect student ID.",
            });
        }

        // Validate password strength
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must have at least 8 characters, uppercase, lowercase, number, and special character.",
            });
        }

        // Confirm passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match.",
            });
        }

        // Check existing email
        const existingEmail = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (existingEmail) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        // Check existing student ID
        const existingStudent = await User.findOne({
            studentId: studentId.trim(),
        });

        if (existingStudent) {
            return res.status(409).json({
                message: "This student ID is already registered.",
            });
        }

        // Create student account
        const user = await User.create({
            fullName: fullName.trim(),
            studentId: studentId.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: "student",
        });

        const token = generateToken(user._id.toString(), user.role);

        return res.status(201).json({
            message: "Account created successfully.",
            token,
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
    } catch (error: any) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email or student ID is already registered.",
            });
        }

        return res.status(500).json({
            message: "Registration failed. Please try again.",
        });
    }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        // Password is excluded by default, so explicitly select it
        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const token = generateToken(user._id.toString(), user.role);

        return res.status(200).json({
            message: "Login successful.",
            token,
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
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed. Please try again.",
        });
    }
};

export {
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    deleteMyAccount,
} from "./user.controller";
