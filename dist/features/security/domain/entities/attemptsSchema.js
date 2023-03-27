"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.attemptsSchema = new mongoose_1.default.Schema({
    clientIp: { type: String, required: true },
    requestedUrl: { type: String, required: true },
    requestDate: { type: Date, required: true },
});
//# sourceMappingURL=attemptsSchema.js.map