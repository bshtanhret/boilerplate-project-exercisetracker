import express from 'express'
import { addExercise, createUser, getAllExercises, getAllUsers } from '../controllers/users';
import { createUserValidation } from '../validations/createUser';
import { addExerciseValidation } from '../validations/addExercise';
import { param } from 'express-validator';
import { isValidObjectId } from 'mongoose';
import { validatorMiddleware } from '../middlewares/validator';

const router = express.Router();

router.post('/', createUserValidation, createUser)

router.get('/', getAllUsers)

router.post(
    '/:_id/exercises',
    addExerciseValidation,
    addExercise
)

router.get(
    '/:_id/logs',
    param('_id').custom((value) => isValidObjectId(value)).withMessage('_id is not valid!'),
    validatorMiddleware,
    getAllExercises
)


export { router as usersRouter }