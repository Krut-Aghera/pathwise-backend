import { describe, it, expect } from "vitest";
import request from "supertest";

import app from "../../src/app.js";

describe("Progress API", () => {

    it("should return 404 for an unknown route", async () => {

        const response = await request(app)
            .get("/this-route-does-not-exist");

        expect(response.status).toBe(404);

    });

});