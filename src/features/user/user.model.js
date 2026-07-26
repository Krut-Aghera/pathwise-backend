import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/error-handler.utility.js";
import REGEX_VALIDATIONS from "../../constants/regex-validation.js";
import { ROLES, ROLES_LIST } from "./user.constants.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            lowercase: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            match: [
                REGEX_VALIDATIONS.username.PATTERN,
                REGEX_VALIDATIONS.username.MESSAGE,
            ],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                REGEX_VALIDATIONS.email.PATTERN,
                REGEX_VALIDATIONS.email.MESSAGE,
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            select: false, // never returned by default in queries
            match: [
                REGEX_VALIDATIONS.password.PATTERN,
                REGEX_VALIDATIONS.password.MESSAGE,
            ],
        },

        role: {
            type: String,
            enum: {
                values: ROLES_LIST,
                message: "{VALUE} is not a valid role",
            },
            default: ROLES.STUDENT,
        },

        emailVerificationToken: {
            type: String,
            default: null,
            select: false,
        },

        emailVerificationExpiry: {
            type: Date,
            default: null,
            select: false,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        refreshToken: {
            type: String,
            default: null,
            select: false,
        },

        pendingEmail: {
            type: String,
            default: null,
            select: false,
        },

        emailChangeToken: {
            type: String,
            select: false,
            default: null,
        },

        emailChangeTokenExpiry: {
            type: Date,
            select: false,
            default: null,
        },

        resetPasswordToken: {
            type: String,
            default: null,
            select: false,
        },

        resetPasswordExpiry: {
            type: Date,
            default: null,
            select: false,
        },

        instructorAccessToken: {
            type: String,
            select: false,
            default: null,
        },

        instructorAccessTokenExpiry: {
            type: Date,
            select: false,
            default: null,
        },

        accountDeactivationOtp: {
            type: String,
            select: false,
        },

        accountDeactivationOtpExpiry: {
            type: Date,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

///////////////////////////////////////////////////////////////
// indexes
userSchema.index({ role: 1 }); // fast role-based filtering (admin dashboards)

///////////////////////////////////////////////////////////////
// hashing password before save

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

///////////////////////////////////////////////////////////////
// Instance methods

userSchema.methods.comparePassword = async function (givenPassword) {
    return bcrypt.compare(givenPassword, this.password);
};

userSchema.methods.generateResetPasswordToken = async function () {
    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpiry = Date.now() + 5 * 60 * 1000;

    await this.save({ validateBeforeSave: false });

    return token;
};

///////////////////////////////////////////////////////////////
// Strip sensitive fields
const transform = (doc, ret) => {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpiry;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpiry;

    return ret;
};

userSchema.set("toJSON", {
    versionKey: false,
    transform,
});

userSchema.set("toObject", {
    versionKey: false,
    transform,
});

const User = mongoose.model("User", userSchema);
export default User;
