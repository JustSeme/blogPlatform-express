"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDBModel = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
class UserDBModel {
    constructor(login, email, passwordHash, isConfirmed) {
        this.login = login;
        this.email = email;
        this.passwordHash = passwordHash;
        this.id = (0, uuid_1.v4)();
        this.createdAt = new Date().toISOString();
        this.emailConfirmation = {
            confirmationCode: (0, uuid_1.v4)(),
            expirationDate: (0, date_fns_1.add)(new Date(), {
                hours: 1,
                minutes: 3
            }),
            isConfirmed: isConfirmed
        };
        this.passwordRecovery = {
            confirmationCode: null,
            expirationDate: new Date()
        };
    }
}
exports.UserDBModel = UserDBModel;
//# sourceMappingURL=UserDBModel.js.map