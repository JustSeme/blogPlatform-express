"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentsSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    content: { type: String, required: true, min: 20, max: 300 },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
});
//# sourceMappingURL=commentsSchema.js.map