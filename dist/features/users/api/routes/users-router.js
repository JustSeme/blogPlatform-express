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
exports.emailValidationWithCustomSearch = exports.passwordValidation = exports.loginValidation = exports.usersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../../../../composition-root");
const users_controller_1 = require("../../../auth/api/controllers/users-controller");
const basic_authorizatoin_middleware_1 = require("../../../../middlewares/auth/basic-authorizatoin-middleware");
const input_validation_middleware_1 = require("../../../../middlewares/validations/input-validation-middleware");
const users_query_repository_1 = require("../../../../repositories/query/users-query-repository");
exports.usersRouter = (0, express_1.Router)({});
const usersController = composition_root_1.container.resolve(users_controller_1.UsersController);
exports.loginValidation = (0, express_validator_1.body)('login')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 10 })
    .matches(/^[a-zA-Z0-9_-]*$/, 'i')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    return users_query_repository_1.usersQueryRepository.findUserByLogin(login).then(user => {
        if (user) {
            throw new Error('Login already in use');
        }
    });
}));
exports.passwordValidation = (0, express_validator_1.body)('password')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 20 });
exports.emailValidationWithCustomSearch = (0, express_validator_1.body)('email')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    return users_query_repository_1.usersQueryRepository.findUserByEmail(email).then(user => {
        if (user) {
            throw new Error('Email already in use');
        }
    });
}));
exports.usersRouter.post('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, exports.loginValidation, exports.passwordValidation, exports.emailValidationWithCustomSearch, input_validation_middleware_1.inputValidationMiddleware, usersController.createUser.bind(usersController));
exports.usersRouter.delete('/:id', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, usersController.deleteUser.bind(usersController));
exports.usersRouter.get('/', basic_authorizatoin_middleware_1.basicAuthorizationMiddleware, usersController.getUsers.bind(usersController));
//# sourceMappingURL=users-router.js.map