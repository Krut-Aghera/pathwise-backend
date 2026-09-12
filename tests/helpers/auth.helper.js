import request from "supertest";

import app from "../../src/app.js";
import User from "../../src/features/user/user.model.js";

///////////////////////////////////////////////////////////////
// create authenticated student agent

const createAuthenticatedStudentAgent = async () => {
    const agent = request.agent(app);

    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = await agent.post("/api/v1/auth/users").send({
        username: `Test Student ${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
        )}`,
        email: `test_student_${uniqueId}@example.com`,
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
        user,
    };
};

///////////////////////////////////////////////////////////////
// exports

export { createAuthenticatedStudentAgent };
