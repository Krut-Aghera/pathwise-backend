import mongoose from "mongoose";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import * as enrollmentRepository from "../../../src/features/enrollment/enrollment.repository.js";
import * as enrollmentService from "../../../src/features/enrollment/enrollment.service.js";

////////////////////////////////////////////////////////////////
// TEST SUITE
////////////////////////////////////////////////////////////////

describe("Enrollment service - createEnrollment", () => {
    ////////////////////////////////////////////////////////////////
    // SETUP
    ////////////////////////////////////////////////////////////////

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    ////////////////////////////////////////////////////////////////
    // NORMAL ENROLLMENT CREATION
    ////////////////////////////////////////////////////////////////

    it("should create and return a new enrollment when the student is not already enrolled", async () => {
        const studentId = new mongoose.Types.ObjectId();
        const courseId = new mongoose.Types.ObjectId();
        const orderId = new mongoose.Types.ObjectId();
        const paymentId = new mongoose.Types.ObjectId();

        const createdEnrollment = {
            _id: new mongoose.Types.ObjectId(),
            student: studentId,
            course: courseId,
            order: orderId,
            payment: paymentId,
        };

        /*
         * First lookup confirms that the student is not already
         * enrolled in the course.
         */
        vi.spyOn(enrollmentRepository, "findEnrollment").mockResolvedValueOnce(
            null
        );

        /*
         * Enrollment creation succeeds normally.
         */
        vi.spyOn(
            enrollmentRepository,
            "createEnrollment"
        ).mockResolvedValueOnce(createdEnrollment);

        const result = await enrollmentService.createEnrollment({
            enrollmentPayload: {
                student: studentId,
                course: courseId,
                order: orderId,
                payment: paymentId,
            },
        });

        ////////////////////////////////////////////////////////////////
        // RESULT
        ////////////////////////////////////////////////////////////////

        expect(result).toBe(createdEnrollment);

        ////////////////////////////////////////////////////////////////
        // REPOSITORY CALLS
        ////////////////////////////////////////////////////////////////

        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledTimes(1);

        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledWith({
            studentId,
            courseId,
        });

        expect(enrollmentRepository.createEnrollment).toHaveBeenCalledTimes(1);

        expect(enrollmentRepository.createEnrollment).toHaveBeenCalledWith({
            enrollmentPayload: {
                student: studentId,
                course: courseId,
                order: orderId,
                payment: paymentId,
            },
        });
    });

    ////////////////////////////////////////////////////////////////
    // EXISTING ENROLLMENT
    ////////////////////////////////////////////////////////////////

    it("should return the existing enrollment when the student is already enrolled", async () => {
        const studentId = new mongoose.Types.ObjectId();
        const courseId = new mongoose.Types.ObjectId();
        const orderId = new mongoose.Types.ObjectId();
        const paymentId = new mongoose.Types.ObjectId();

        const existingEnrollment = {
            _id: new mongoose.Types.ObjectId(),
            student: studentId,
            course: courseId,
            order: orderId,
            payment: paymentId,
        };

        /*
         * The first lookup finds an existing enrollment.
         *
         * The service should immediately return it instead of
         * attempting to create another enrollment.
         */
        vi.spyOn(enrollmentRepository, "findEnrollment").mockResolvedValueOnce(
            existingEnrollment
        );

        const createEnrollmentSpy = vi.spyOn(
            enrollmentRepository,
            "createEnrollment"
        );

        const result = await enrollmentService.createEnrollment({
            enrollmentPayload: {
                student: studentId,
                course: courseId,
                order: orderId,
                payment: paymentId,
            },
        });

        ////////////////////////////////////////////////////////////////
        // RESULT
        ////////////////////////////////////////////////////////////////

        expect(result).toBe(existingEnrollment);

        ////////////////////////////////////////////////////////////////
        // REPOSITORY CALLS
        ////////////////////////////////////////////////////////////////

        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledTimes(1);

        expect(createEnrollmentSpy).not.toHaveBeenCalled();
    });

    ////////////////////////////////////////////////////////////////
    // DUPLICATE KEY RACE RECOVERY
    ////////////////////////////////////////////////////////////////

    it("should return the existing enrollment when enrollment creation hits a duplicate key error", async () => {
        const studentId = new mongoose.Types.ObjectId();
        const courseId = new mongoose.Types.ObjectId();
        const orderId = new mongoose.Types.ObjectId();
        const paymentId = new mongoose.Types.ObjectId();

        const existingEnrollment = {
            _id: new mongoose.Types.ObjectId(),
            student: studentId,
            course: courseId,
            order: orderId,
            payment: paymentId,
        };

        /*
         * This test simulates the following race condition:
         *
         * Request A:
         *   1. Checks for enrollment -> none found.
         *
         * Request B:
         *   2. Creates the enrollment first.
         *
         * Request A:
         *   3. Attempts to create the same enrollment.
         *   4. MongoDB unique index throws error code 11000.
         *   5. Service checks again for the enrollment.
         *   6. Existing enrollment is now found.
         *
         * The service should recover from the duplicate-key error
         * and return the enrollment created by the other request.
         */

        vi.spyOn(enrollmentRepository, "findEnrollment")
            // First lookup: no enrollment exists yet.
            .mockResolvedValueOnce(null)

            // Second lookup: another request has created it.
            .mockResolvedValueOnce(existingEnrollment);

        /*
         * Simulate MongoDB's duplicate-key error.
         *
         * In the real database this would happen because of the
         * unique { student, course } index on Enrollment.
         */
        vi.spyOn(
            enrollmentRepository,
            "createEnrollment"
        ).mockRejectedValueOnce({
            code: 11000,
        });

        const result = await enrollmentService.createEnrollment({
            enrollmentPayload: {
                student: studentId,
                course: courseId,
                order: orderId,
                payment: paymentId,
            },
        });

        ////////////////////////////////////////////////////////////////
        // RESULT
        ////////////////////////////////////////////////////////////////

        expect(result).toBe(existingEnrollment);

        ////////////////////////////////////////////////////////////////
        // CREATE ATTEMPT
        ////////////////////////////////////////////////////////////////

        /*
         * The service should have attempted creation exactly once.
         */
        expect(enrollmentRepository.createEnrollment).toHaveBeenCalledTimes(1);

        expect(enrollmentRepository.createEnrollment).toHaveBeenCalledWith({
            enrollmentPayload: {
                student: studentId,
                course: courseId,
                order: orderId,
                payment: paymentId,
            },
        });

        ////////////////////////////////////////////////////////////////
        // FIND ENROLLMENT
        ////////////////////////////////////////////////////////////////

        /*
         * findEnrollment() must be called twice:
         *
         * 1. Before creation to check whether enrollment already exists.
         * 2. After 11000 to recover the enrollment created by the
         *    competing request.
         */
        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledTimes(2);

        expect(enrollmentRepository.findEnrollment).toHaveBeenNthCalledWith(1, {
            studentId,
            courseId,
        });

        expect(enrollmentRepository.findEnrollment).toHaveBeenNthCalledWith(2, {
            studentId,
            courseId,
        });
    });

    ////////////////////////////////////////////////////////////////
    // DUPLICATE KEY WITHOUT EXISTING ENROLLMENT
    ////////////////////////////////////////////////////////////////

    it("should rethrow the duplicate key error when enrollment still does not exist", async () => {
        const studentId = new mongoose.Types.ObjectId();
        const courseId = new mongoose.Types.ObjectId();
        const orderId = new mongoose.Types.ObjectId();
        const paymentId = new mongoose.Types.ObjectId();

        const duplicateError = {
            code: 11000,
        };

        /*
         * Simulate:
         *
         * 1. Initial lookup -> no enrollment.
         * 2. Create -> MongoDB returns duplicate-key error.
         * 3. Recovery lookup -> still no enrollment.
         *
         * This should be treated as an unexpected database state.
         * Therefore the original error must be rethrown.
         */

        vi.spyOn(enrollmentRepository, "findEnrollment")
            // Initial check.
            .mockResolvedValueOnce(null)

            // Recovery check after duplicate-key error.
            .mockResolvedValueOnce(null);

        vi.spyOn(
            enrollmentRepository,
            "createEnrollment"
        ).mockRejectedValueOnce(duplicateError);

        ////////////////////////////////////////////////////////////////
        // EXPECT ERROR
        ////////////////////////////////////////////////////////////////

        await expect(
            enrollmentService.createEnrollment({
                enrollmentPayload: {
                    student: studentId,
                    course: courseId,
                    order: orderId,
                    payment: paymentId,
                },
            })
        ).rejects.toBe(duplicateError);

        ////////////////////////////////////////////////////////////////
        // REPOSITORY CALLS
        ////////////////////////////////////////////////////////////////

        expect(enrollmentRepository.createEnrollment).toHaveBeenCalledTimes(1);

        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledTimes(2);

        expect(enrollmentRepository.findEnrollment).toHaveBeenNthCalledWith(1, {
            studentId,
            courseId,
        });

        expect(enrollmentRepository.findEnrollment).toHaveBeenNthCalledWith(2, {
            studentId,
            courseId,
        });
    });

    ////////////////////////////////////////////////////////////////
    // NON-DUPLICATE DATABASE ERROR
    ////////////////////////////////////////////////////////////////

    it("should rethrow non-duplicate database errors", async () => {
        const studentId = new mongoose.Types.ObjectId();
        const courseId = new mongoose.Types.ObjectId();
        const orderId = new mongoose.Types.ObjectId();
        const paymentId = new mongoose.Types.ObjectId();

        const databaseError = new Error("Database connection failed");

        /*
         * The initial lookup confirms that no enrollment exists.
         */
        vi.spyOn(enrollmentRepository, "findEnrollment").mockResolvedValueOnce(
            null
        );

        /*
         * Simulate an unrelated database error.
         *
         * Because this is NOT error code 11000, the service should
         * not perform the duplicate-enrollment recovery lookup.
         */
        vi.spyOn(
            enrollmentRepository,
            "createEnrollment"
        ).mockRejectedValueOnce(databaseError);

        ////////////////////////////////////////////////////////////////
        // EXPECT ERROR
        ////////////////////////////////////////////////////////////////

        await expect(
            enrollmentService.createEnrollment({
                enrollmentPayload: {
                    student: studentId,
                    course: courseId,
                    order: orderId,
                    payment: paymentId,
                },
            })
        ).rejects.toBe(databaseError);

        ////////////////////////////////////////////////////////////////
        // VERIFY NO RECOVERY LOOKUP
        ////////////////////////////////////////////////////////////////

        /*
         * findEnrollment() should only have been called once:
         * the initial existence check.
         *
         * The service must NOT attempt duplicate-key recovery for
         * unrelated database errors.
         */
        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledTimes(1);

        expect(enrollmentRepository.findEnrollment).toHaveBeenCalledWith({
            studentId,
            courseId,
        });

        expect(enrollmentRepository.createEnrollment).toHaveBeenCalledTimes(1);
    });
});
