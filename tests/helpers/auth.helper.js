import request from "supertest";

import app from "../../src/app.js";
import User from "../../src/features/user/user.model.js";

const createAuthenticatedStudentAgent = async () => {
    const agent = request.agent(app);

    const response = await agent
        .post("/api/v1/auth/users")
        .send({
            username: `test_student_${Date.now()}`,
            email: `test_student_${Date.now()}@example.com`,
            password: "Test@123456",
        });

    if (response.status !== 201) {
        throw new Error(
            `Failed to create test student: ${JSON.stringify(response.body)}`
        );
    }

    const user = await User.findByIdAndUpdate(
        { _id: response.body.data._id },
        { isEmailVerified: true },
        { returnDocument: "after" }
    );

    return {
        agent,
        user
    };
};

export { createAuthenticatedStudentAgent };