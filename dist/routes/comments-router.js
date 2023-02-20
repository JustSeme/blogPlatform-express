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
exports.commentContentValidation = exports.commentsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const app_1 = require("../app");
const comments_service_1 = require("../domain/comments-service");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const commentId_validation_middleware_1 = require("../middlewares/validations/commentId-validation-middleware");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
const ownership_validation_middleware_1 = require("../middlewares/validations/ownership-validation-middleware");
const comments_query_repository_1 = require("../repositories/query/comments-query-repository");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentContentValidation = (0, express_validator_1.body)('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 20, max: 300 });
exports.commentsRouter.get('/:commentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.commentId);
    if (!findedComment) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.send(findedComment);
}));
exports.commentsRouter.delete('/:commentId', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, ownership_validation_middleware_1.ownershipValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield comments_service_1.commentsService.deleteComment(req.params.commentId);
    if (!isDeleted) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.commentsRouter.put('/:commentId', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, ownership_validation_middleware_1.ownershipValidationMiddleware, exports.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield comments_service_1.commentsService.updateComment(req.params.commentId, req.body.content);
    if (!isUpdated) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
//# sourceMappingURL=comments-router.js.map