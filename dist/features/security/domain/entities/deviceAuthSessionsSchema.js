"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceAuthSessionsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.deviceAuthSessionsSchema = new mongoose_1.default.Schema({
    issuedAt: { type: Number, required: true },
    expireDate: { type: Number, required: true },
    userInfo: {
        userId: { type: String, required: true },
        userIp: { type: String, required: true },
    },
    deviceInfo: {
        deviceId: { type: String, required: true },
        deviceName: { type: String, required: true },
    },
});
//# sourceMappingURL=deviceAuthSessionsSchema.js.map