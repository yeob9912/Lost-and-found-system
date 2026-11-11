import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    fullName: string;
    studentId: string;
    email: string;
    password: string;
    role: "student" | "admin";
    profileImage: string;
    profileImagePublicId: string;
    phone?: string;
    department?: string;
    yearOfStudy?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const studentIdRegex = /^UGR\/[0-9]{5}\/[0-9]{2}$/;

const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const userSchema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 2,
        },
        profileImage: {
            type: String,
            default: "",
        },

        profileImagePublicId: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        department: {
            type: String,
            default: "",
            trim: true,
        },

        yearOfStudy: {
            type: String,
            default: "",
            trim: true,
        },

        studentId: {
            type: String,
            required: [true, "Student ID is required"],
            unique: true,
            trim: true,
            match: [
                studentIdRegex,
                "Student ID must follow UGR/12345/26 format",
            ],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please enter a valid email address",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            match: [
                strongPasswordRegex,
                "Password must contain uppercase, lowercase, number, and special character",
            ],
            select: false,
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;