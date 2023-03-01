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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const users_db_repository_1 = require("../repositories/users-db-repository");
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const emailManager_1 = require("../managers/emailManager");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const bcryptAdapter_1 = require("../adapters/bcryptAdapter");
const getUserDto = (login, password, email, isConfirmed) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield bcryptAdapter_1.bcryptAdapter.generatePasswordHash(password, 10);
    const newUser = {
        id: (0, uuid_1.v4)(),
        login: login,
        email: email,
        passwordHash,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: (0, uuid_1.v4)(),
            expirationDate: (0, add_1.default)(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: isConfirmed
        },
    };
    return newUser;
});
exports.authService = {
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield getUserDto(login, password, email, false);
            yield users_db_repository_1.usersRepository.createUser(newUser);
            yield emailManager_1.emailManager.sendConfirmationCode(email, login, newUser.emailConfirmation.confirmationCode);
            return true;
        });
    },
    createUserWithBasicAuth(login, password, email, ip = 'superAdmin') {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield getUserDto(login, password, email, true);
            yield users_db_repository_1.usersRepository.createUser(newUser);
            const displayedUser = {
                id: newUser.id,
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
            return displayedUser;
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByConfirmationCode(code);
            if (!user)
                return false;
            if (user.emailConfirmation.isConfirmed)
                return false;
            if (user.emailConfirmation.confirmationCode !== code)
                return false;
            if (user.emailConfirmation.expirationDate < new Date())
                return false;
            return yield users_db_repository_1.usersRepository.updateIsConfirmed(user.id);
        });
    },
    resendConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByEmail(email);
            if (!user || user.emailConfirmation.isConfirmed)
                return false;
            const newConfirmationCode = (0, uuid_1.v4)();
            yield users_db_repository_1.usersRepository.updateEmailConfirmationInfo(user.id, newConfirmationCode);
            try {
                return yield emailManager_1.emailManager.sendConfirmationCode(email, user.login, newConfirmationCode);
            }
            catch (error) {
                console.error(error);
                users_db_repository_1.usersRepository.deleteUser(user.id);
                return false;
            }
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user)
                return false;
            if (!user.emailConfirmation.isConfirmed)
                return false;
            const isConfirmed = yield bcryptAdapter_1.bcryptAdapter.comparePassword(password, user.passwordHash);
            if (isConfirmed) {
                return user;
            }
        });
    },
    deleteUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                return yield users_db_repository_1.usersRepository.deleteUser(userId);
            }
            return yield users_db_repository_1.usersRepository.deleteUsers();
        });
    }
};
//# sourceMappingURL=auth-service.js.map