"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const app_1 = require("../app");
const users_service_1 = require("../domain/users-service");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.authRouter = (0, express_1.Router)({});
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .exists()
    .trim()
    .notEmpty()
    .isString();
const passwordValidation = (0, express_validator_1.body)('password')
    .exists()
    .trim()
    .notEmpty()
    .isString();
exports.authRouter.post('/login', loginOrEmailValidation, passwordValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkResult = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!checkResult) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
//# sourceMappingURL=auth-router.js.map