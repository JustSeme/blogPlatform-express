"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfirmationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.EmailConfirmationSchema = new mongoose_1.default.Schema({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
});
//# sourceMappingURL=EmailConfirmationSchema.js.map