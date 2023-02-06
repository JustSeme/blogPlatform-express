"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const crypto_1 = require("crypto");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
exports.commentsService = {
    createComment(content, commentator, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!commentator) {
                return null;
            }
            const createdComment = {
                id: (0, crypto_1.randomUUID)(),
                content,
                commentatorInfo: {
                    userId: commentator.id,
                    userLogin: commentator.login
                },
                createdAt: new Date().toISOString(),
                postId
            };
            yield comments_db_repository_1.commentsRepository.createComment(createdComment);
            return {
                id: createdComment.id,
                content: createdComment.content,
                commentatorInfo: Object.assign({}, createdComment.commentatorInfo),
                createdAt: createdComment.createdAt
            };
        });
    },
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.deleteComment(commentId);
        });
    },
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.updateComment(commentId, content);
        });
    }
};
//# sourceMappingURL=comments-service.js.map