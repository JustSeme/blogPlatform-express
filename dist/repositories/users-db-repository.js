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
exports.usersRepository = void 0;
const date_fns_1 = require("date-fns");
const db_1 = require("./db");
exports.usersRepository = {
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new db_1.UsersModel(newUser).save();
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = db_1.UsersModel.find({ id });
            const result = yield deletedUser.deleteOne();
            return result.deletedCount === 1;
        });
    },
    deleteUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.deleteMany({});
            return result.deletedCount > 0;
        });
    },
    updateIsConfirmed(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.matchedCount === 1;
        });
    },
    updateEmailConfirmationInfo(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 3
                    })
                }
            });
            return result.matchedCount === 1;
        });
    },
    updatePasswordConfirmationInfo(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, {
                $set: {
                    'passwordRecovery.confirmationCode': code,
                    'passwordRecovery.expirationDate': (0, date_fns_1.add)(new Date(), {
                        hours: 1,
                        minutes: 3
                    })
                }
            });
            return result.matchedCount === 1;
        });
    },
    updateUserPassword(id, newPasswordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.UsersModel.updateOne({ id: id }, {
                $set: {
                    'passwordHash': newPasswordHash,
                    'passwordRecovery.confirmationCode': null
                }
            });
            return result.matchedCount === 1;
        });
    }
};
//# sourceMappingURL=users-db-repository.js.map