"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.postsSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true, min: 3, max: 30 },
    shortDescription: { type: String, required: true, min: 3, max: 100 },
    content: { type: String, required: true, min: 3, max: 1000 },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true }
});
//# sourceMappingURL=postsSchema.js.map