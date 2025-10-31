import { body, param } from "express-validator";
import { validatorMiddleware } from "../middlewares/validator";
import { isValidObjectId } from "mongoose";

export const addExerciseValidation = [
    param('_id').custom((value) => isValidObjectId(value)).withMessage('_id is not valid!'),
    body('description').isLength({ min: 3 }).withMessage('Description should be at least 3 characters!'),
    body('description').isLength({ max: 100 }).withMessage('Description should be not longer than 100 characters!'),
    body('duration').isNumeric().withMessage('Invalid duration!'),
    body('date').custom((value) => {
        if (!value) return true
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error('Date must be in YYYY-MM-DD format');
        }
        return true
    }).withMessage('Date must be in YYYY-MM-DD format!'),
    validatorMiddleware
]