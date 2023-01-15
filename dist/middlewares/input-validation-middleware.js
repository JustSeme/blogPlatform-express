"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const validation_result_1 = require("express-validator/src/validation-result");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(el => {
            return {
                message: el.msg,
                field: el.param
            };
        });
        res.status(400).json({ errorsMessages: errorsMessages });
        return;
    }
    next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//# sourceMappingURL=input-validation-middleware.js.map