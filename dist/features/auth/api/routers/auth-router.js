"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../../../../composition-root");
const auth_controller_1 = require("../controllers/auth-controller");
const auth_middleware_1 = require("../../../../middlewares/auth/auth-middleware");
const rate_limit_middleware_1 = require("../../../../middlewares/auth/rate-limit-middleware");
const input_validation_middleware_1 = require("../../../../middlewares/validations/input-validation-middleware");
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
const newPasswordValidation = (0, express_validator_1.body)('newPassword')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 20 });
/* Напиши тесты */
const authController = composition_root_1.container.resolve(auth_controller_1.AuthController);
exports.authRouter.post('/login', rate_limit_middleware_1.rateLimitMiddleware, loginOrEmailValidation, users_router_1.passwordValidation, input_validation_middleware_1.inputValidationMiddleware, authController.login.bind(authController));
exports.authRouter.post('/refresh-token', authController.refreshTokens.bind(authController));
exports.authRouter.post('/logout', authController.logout.bind(authController));
exports.authRouter.post('/registration', rate_limit_middleware_1.rateLimitMiddleware, users_router_1.loginValidation, users_router_1.passwordValidation, users_router_1.emailValidationWithCustomSearch, input_validation_middleware_1.inputValidationMiddleware, authController.registration.bind(authController));
exports.authRouter.post('/registration-confirmation', rate_limit_middleware_1.rateLimitMiddleware, authController.registrationConfirm.bind(authController));
exports.authRouter.post('/registration-email-resending', rate_limit_middleware_1.rateLimitMiddleware, emailValidation, input_validation_middleware_1.inputValidationMiddleware, authController.resendEmail.bind(authController));
exports.authRouter.post('/password-recovery', rate_limit_middleware_1.rateLimitMiddleware, emailValidation, input_validation_middleware_1.inputValidationMiddleware, authController.recoveryPassword.bind(authController));
exports.authRouter.post('/new-password', rate_limit_middleware_1.rateLimitMiddleware, newPasswordValidation, input_validation_middleware_1.inputValidationMiddleware, authController.generateNewPassword.bind(authController));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, authController.sendUserInfo.bind(authController));
//# sourceMappingURL=auth-router.js.map