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
exports.commentsRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const comments_service_1 = require("../domain/comments-service");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const comments_query_repository_1 = require("../repositories/query/comments-query-repository");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.commentId);
    if (!findedComment) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.send(findedComment);
}));
exports.commentsRouter.delete('/:commentId', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield comments_service_1.commentsService.deleteComment(req.params.commentId);
    if (!isDeleted) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
//# sourceMappingURL=comments-router.js.map