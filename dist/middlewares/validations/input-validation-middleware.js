"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const validation_result_1 = require("express-validator/src/validation-result");
const settings_1 = require("../../settings");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsObj = errors.mapped();
        let status = settings_1.HTTP_STATUSES.BAD_REQUEST_400;
        const errorsMessages = Object.keys(errorsObj).map(key => {
            if (errorsObj[key].msg === 'blog is not found') {
                status = settings_1.HTTP_STATUSES.NOT_FOUND_404;
            }
            return {
                message: errorsObj[key].msg,
                field: key
            };
        });
        res.status(status).json({ errorsMessages: errorsMessages });
        return;
    }
    next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//# sourceMappingURL=input-validation-middleware.js.map