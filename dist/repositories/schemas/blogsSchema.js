"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.blogsSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true, min: 3, max: 15 },
    description: { type: String, required: true, min: 3, max: 500 },
    websiteUrl: { type: String, required: true, min: 3, max: 100 },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
});
exports.blogsSchema.path('websiteUrl').validate((val) => {
    const urlRegex = new RegExp('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    return urlRegex.test(val);
}, 'Invalid URL.');
//# sourceMappingURL=blogsSchema.js.map