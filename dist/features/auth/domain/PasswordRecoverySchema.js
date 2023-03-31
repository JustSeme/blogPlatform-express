"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordRecoverySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.PasswordRecoverySchema = new mongoose_1.default.Schema({
    confirmationCode: {
        type: String, required: true
    },
    expirationDate: {
        type: Date, required: true
    }
});
//# sourceMappingURL=PasswordRecoverySchema.js.map