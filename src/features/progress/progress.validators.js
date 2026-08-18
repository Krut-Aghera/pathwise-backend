import { body } from "express-validator";

////////////////////////////////////////////////////////////////
// update lecture progress validator

const updateLectureProgressValidator = [
    body("lastPosition")
        .exists()
        .withMessage("Last position is required")
        .isFloat({ min: 0 })
        .withMessage("Last position must be a non-negative number"),

    body("watchedDuration")
        .exists()
        .withMessage("Watched duration is required")
        .isFloat({ min: 0 })
        .withMessage("Watched duration must be a non-negative number"),
];

////////////////////////////////////////////////////////////////
// exports

export { updateLectureProgressValidator };
