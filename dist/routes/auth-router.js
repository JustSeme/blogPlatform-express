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
const jwtService_1 = require("../application/jwtService");
const auth_service_1 = require("../domain/auth-service");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const users_router_1 = require("./users-router");
exports.authRouter = (0, express_1.Router)({});
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .exists()
    .trim()
    .notEmpty()
    .isString();
const emailValidation = (0, express_validator_1.body)('email')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
exports.authRouter.post('/login', loginOrEmailValidation, users_router_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const jwtTokenObj = yield jwtService_1.jwtService.createJWT(user.id);
    res.send(jwtTokenObj);
}));
exports.authRouter.post('/registration', users_router_1.loginValidation, users_router_1.passwordValidation, users_router_1.emailValidationWithCustomSearch, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const isCreated = yield auth_service_1.authService.createUser(req.body.login, req.body.password, req.body.email, clientIp);
    if (!isCreated) {
        res.sendStatus(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.authRouter.post('/registration-confirmation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmed = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (!isConfirmed) {
        res
            .status(app_1.HTTP_STATUSES.BAD_REQUEST_400)
            .send({ errorsMessages: [{
                    message: 'The confirmation code is incorrect, expired or already been applied',
                    field: 'code'
                }] });
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.authRouter.post('/registration-email-resending', emailValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.resendConfirmationCode(req.body.email);
    if (!result) {
        res
            .status(app_1.HTTP_STATUSES.BAD_REQUEST_400)
            .send({ errorsMessages: [{
                    message: 'Your email is already confirmed or doesnt exist',
                    field: 'email'
                }] });
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, (req, res) => {
    const user = req.user;
    res.send({
        email: user.email,
        login: user.login,
        userId: user.id
    });
});
//# sourceMappingURL=auth-router.js.map