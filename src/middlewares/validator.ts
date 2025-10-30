import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send({ error: result.array()[0]?.msg })
        return
    }

    next()
}