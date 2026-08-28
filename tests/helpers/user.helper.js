import User from "../../src/features/user/user.model.js";
import { ROLES } from "../../src/features/user/user.constants";

///////////////////////////////////////////////////////////////
// create test instructure

const createTestInstructor = async () => {
    return await User.create({
        username: `test_instructor_${Date.now()}`,
        email: `test_instructor_${Date.now()}@example.com`,
        password: "TestPassword123!",
        role: ROLES.INSTRUCTOR,
        isEmailVerified: true,
        isActive: true,
    });
};

///////////////////////////////////////////////////////////////
// exports

export { createTestInstructor };
