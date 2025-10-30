
import { body } from 'express-validator';
import { validatorMiddleware } from '../middlewares/validator';

export const createUserValidation = [
    body('username').isLength({ min: 3, max: 100 }).withMessage('Username should be at least 3 characters!'),
    body('username').isLength({ max: 100 }).withMessage('Username should be not longer than 100 characters!'),
    validatorMiddleware
]