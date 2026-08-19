import { describe, it, expect } from "vitest";

import {
    calculateLectureProgressPercentage,
    calculateCourseProgressPercentage,
    hasLectureReachedCompletionThreshold
} from "../../src/features/progress/progress.utility.js";

describe("calculateLectureProgressPercentage", () => {
    it("should calculate lecture progress percentage correctly", () => {
        const result = calculateLectureProgressPercentage({
            watchedDuration: 120,
            duration: 300
        })
        expect(result).toBe(40)
    }),
        it("should return 0 when duration is 0", () => {
            const result = calculateLectureProgressPercentage({
                watchedDuration: 0,
                duration: 0
            })
            expect(result).toBe(0)
        }),
        it("should never return more than 100.", () => {
            const result = calculateLectureProgressPercentage({
                watchedDuration: 400,
                duration: 300
            })
            expect(result).toBe(100)
        }),
        it("should never return negative percentage", () => {
            const result = calculateLectureProgressPercentage({
                watchedDuration: -50,
                duration: 300
            })
            expect(result).toBe(0)
        })
})


describe("calculateCourseProgressPercentage", () => {
    it("should calculate course progress percentage correctly", () => {
        const result = calculateCourseProgressPercentage({
            completedLectures: 5,
            totalLectures: 10
        })
        expect(result).toBe(50)
    }),
        it("should return 0 when no lectures are completed", () => {
            const result = calculateCourseProgressPercentage({
                completedLectures: 0,
                totalLectures: 34
            })
            expect(result).toBe(0)
        }),
        it("should never return more than 100", () => {
            const result = calculateCourseProgressPercentage({
                completedLectures: 40,
                totalLectures: 36
            })
            expect(result).toBe(100)
        }),
        it("it should never return negative number", () => {
            const result = calculateCourseProgressPercentage({
                completedLectures: -5,
                totalLectures: 50
            })
            expect(result).toBe(0)
        }),
        it("should return 0 when totalLectures is less than or equal to 0", () => {
            const result = calculateCourseProgressPercentage({
                completedLectures: 5,
                totalLectures: 0
            })
            expect(result).toBe(0)
        })
})

describe("hasLectureReachedCompletionThreshold", () => {
    it("should return false when percentage is below the threshold", () => {
        const result = hasLectureReachedCompletionThreshold({
            watchedDuration: 500,
            duration: 1000
        })
        expect(result).toBe(false)
    }),
        it("should retun true when percentage reaches the threshold", () => {
            const result = hasLectureReachedCompletionThreshold({
                watchedDuration: 900,
                duration: 1000
            })
            expect(result).toBe(true)
        }),
        it("should return false when duration is <= 0", () => {
            const result = hasLectureReachedCompletionThreshold({
                watchedDuration: 500,
                duration: -50
            })
            expect(result).toBe(false)
        }),
        it("should return false when watechedDuration is > duration", () => {
            const result = hasLectureReachedCompletionThreshold({
                watchedDuration: 500,
                duration: 50
            })
            expect(result).toBe(false)
        })
})