"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.usersSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
    passwordRecovery: {
        confirmationCode: String,
        expirationDate: Date
    }
}, { autoCreate: false, autoIndex: false });
//# sourceMappingURL=usersSchema.js.map