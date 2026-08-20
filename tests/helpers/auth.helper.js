import request from "supertest";

import app from "../../src/app.js";

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

    return {
        agent,
        user: response.body.data,
    };
};

export { createAuthenticatedStudentAgent };