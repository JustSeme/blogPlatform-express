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
exports.usersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const app_1 = require("../app");
const users_service_1 = require("../domain/users-service");
const basic_authorizatoin_middleware_1 = require("../middlewares/basic-authorizatoin-middleware");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
exports.usersRouter = (0, express_1.Router)({});
const loginValidation = (0, express_validator_1.body)('login')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 10 })
    .matches(/^[a-zA-Z0-9_-]*$/, 'i');
const passwordValidation = (0, express_validator_1.body)('password')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 20 });
const emailValidation = (0, express_validator_1.body)('email')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
exports.usersRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, loginValidation, passwordValidation, emailValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield users_service_1.usersService.createUser(req.body.login, req.body.password, req.body.email);
    res.status(app_1.HTTP_STATUSES.CREATED_201).json(createdUser);
}));
exports.usersRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = users_service_1.usersService.deleteUsers(req.params.id);
    if (!isDeleted) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.usersRouter.get('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedUsers = yield users_query_repository_1.usersQueryRepository.findUsers(req.query);
    if (!findedUsers.items.length) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(findedUsers);
}));
//# sourceMappingURL=users-router.js.map