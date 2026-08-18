import "../src/config/env.config.js";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../src/features/user/user.model.js";
import Course from "../src/features/course/course.model.js";
import Order from "../src/features/order/order.model.js";
import Payment from "../src/features/payment/payment.model.js";
import Enrollment from "../src/features/enrollment/enrollment.model.js";

import { ROLES } from "../src/features/user/user.constants.js";

import { RESOURCE_STATUS } from "../src/constants/resource.constants.js";

import {
    ORDER_CURRENCY,
    ORDER_STATUS,
} from "../src/features/order/order.constants.js";

import {
    PAYMENT_PROVIDER,
    PAYMENT_STATUS,
} from "../src/features/payment/payment.constants.js";

import dbConnection from "../src/database/db.connection.js";

////////////////////////////////////////////////////////////////
// seed progress test data

const seedProgressTestData = async () => {
    try {
        await dbConnection.connect();

        console.log("Database connected.");

        ////////////////////////////////////////////////////////////////
        // create / find test instructor

        let instructor = await User.findOne({
            email: "progress.instructor@test.com",
        });

        if (!instructor) {
            instructor = await User.create({
                username: "progress_instructor",
                email: "progress.instructor@test.com",
                password: "Test@12345",
                role: ROLES.INSTRUCTOR,
                isEmailVerified: true,
                isActive: true,
            });

            console.log("Test instructor created.");
        }

        ////////////////////////////////////////////////////////////////
        // create / find test student

        let student = await User.findOne({
            email: "progress.student2@test.com",
        });

        if (!student) {
            student = await User.create({
                username: "progress_student",
                email: "progress.student2@test.com",
                password: "Test@12345",
                role: ROLES.STUDENT,
                isEmailVerified: true,
                isActive: true,
            });

            console.log("Test student created.");
        }

        ////////////////////////////////////////////////////////////////
        // create / find test course

        let course = await Course.findOne({
            slug: "progress-testing-course",
        });

        if (!course) {
            course = await Course.create({
                instructor: instructor._id,

                title: "Progress Testing Course",

                subtitle: "Development course for testing progress tracking.",

                slug: "progress-testing-course",

                description:
                    "Development course used for testing the Pathwise LMS progress tracking feature.",

                price: 999,

                status: RESOURCE_STATUS.PUBLISHED,

                isDeleted: false,
            });

            console.log("Test course created.");
        }

        ////////////////////////////////////////////////////////////////
        // create / find test order

        let order = await Order.findOne({
            student: student._id,
            course: course._id,
        });

        if (!order) {
            order = await Order.create({
                student: student._id,

                course: course._id,

                amount: course.price,

                currency: ORDER_CURRENCY,

                status: ORDER_STATUS.COMPLETED,

                providerOrderId: `TEST_ORDER_${Date.now()}`,
            });

            console.log("Test order created.");
        }

        ////////////////////////////////////////////////////////////////
        // create / find test payment

        let payment = await Payment.findOne({
            order: order._id,
        });

        if (!payment) {
            payment = await Payment.create({
                order: order._id,

                student: student._id,

                amount: order.amount,

                currency: order.currency,

                provider: PAYMENT_PROVIDER.CASHFREE,

                providerOrderId: order.providerOrderId,

                providerPaymentId: `TEST_PAYMENT_${Date.now()}`,

                status: PAYMENT_STATUS.SUCCESS,

                paidAt: new Date(),
            });

            console.log("Test payment created.");
        }

        ////////////////////////////////////////////////////////////////
        // create / find enrollment

        let enrollment = await Enrollment.findOne({
            student: student._id,
            course: course._id,
        });

        if (!enrollment) {
            enrollment = await Enrollment.create({
                student: student._id,

                course: course._id,

                order: order._id,

                payment: payment._id,

                isDeleted: false,
            });

            console.log("Test enrollment created.");
        }

        ////////////////////////////////////////////////////////////////
        // output test data

        console.log("\n========================================");
        console.log("Progress test data is ready.");
        console.log("========================================\n");

        console.log("Student:");
        console.log(`  ID:    ${student._id}`);
        console.log(`  Email: ${student.email}`);

        console.log("\nCourse:");
        console.log(`  ID:   ${course._id}`);
        console.log(`  Slug: ${course.slug}`);

        console.log("\nOrder:");
        console.log(`  ID:     ${order._id}`);
        console.log(`  Status: ${order.status}`);

        console.log("\nPayment:");
        console.log(`  ID:     ${payment._id}`);
        console.log(`  Status: ${payment.status}`);

        console.log("\nEnrollment:");
        console.log(`  ID: ${enrollment._id}`);

        console.log("\nProgress:");
        console.log("  No Progress document was created.");

        console.log("\n========================================\n");
    } catch (error) {
        console.error("Progress seed failed:", error);

        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();

        console.log("Database connection closed.");
    }
};

////////////////////////////////////////////////////////////////
// execute

seedProgressTestData();
