import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator/src/validation-result";
import { HTTP_STATUSES } from "../../settings";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped()
        let status = HTTP_STATUSES.BAD_REQUEST_400

        const errorsMessages = Object.keys(errorsObj).map(key => {
            if (errorsObj[key].msg === 'blog is not found') {
                status = HTTP_STATUSES.NOT_FOUND_404
            }
            return {
                message: errorsObj[key].msg,
                field: key
            }
        });
        res.status(status).json({ errorsMessages: errorsMessages });
        return
    }
    next()
}