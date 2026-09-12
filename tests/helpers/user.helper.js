import User from "../../src/features/user/user.model.js";
import { ROLES } from "../../src/features/user/user.constants";

///////////////////////////////////////////////////////////////
// create test instructure

const createTestInstructor = async () => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return await User.create({
        username: `Test Instructor ${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
        )}`,
        email: `test_instructor_${uniqueId}@example.com`,
        password: "TestPassword123!",
        role: ROLES.INSTRUCTOR,
        isEmailVerified: true,
        isActive: true,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestInstructor };
