"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const validation_result_1 = require("express-validator/src/validation-result");
const app_1 = require("../app");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        const errorsMessages = Object.keys(errorsObj).map(key => {
            return {
                message: errorsObj[key].msg,
                field: key
            };
        });
        res.status(app_1.HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages: errorsMessages });
        return;
    }
    next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//# sourceMappingURL=input-validation-middleware.js.map