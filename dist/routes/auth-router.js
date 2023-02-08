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
const users_service_1 = require("../domain/users-service");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const users_router_1 = require("./users-router");
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
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user) {
        res.sendStatus(app_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const jwtTokenObj = yield jwtService_1.jwtService.createJWT(user);
    res.send(jwtTokenObj);
}));
exports.authRouter.post('/registration', users_router_1.loginValidation, passwordValidation, users_router_1.emailValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
});
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, (req, res) => {
    const user = req.user;
    res.send({
        email: user.email,
        login: user.login,
        userId: user.id
    });
});
//# sourceMappingURL=auth-router.js.map