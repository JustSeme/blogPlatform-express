"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersViewSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UsersViewSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
});
//# sourceMappingURL=usersViewSchema.js.map