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
const settings_1 = require("../settings");
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
const likeValidation = (0, express_validator_1.body)('likeStatus')
    .exists()
    .trim()
    .custom(value => {
    if (value === 'None' || value === 'Like' || value === 'Dislike') {
        return true;
    }
    throw new Error('likeStatus is incorrect');
});
class CommentsController {
    constructor() {
        this.commentsService = new comments_service_1.CommentsService();
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.commentId);
            if (!findedComment) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedComment);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.commentsService.deleteComment(req.params.commentId);
            if (!isDeleted) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield this.commentsService.updateComment(req.params.commentId, req.body.content);
            if (!isUpdated) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    updateLikeForComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization.split(' ')[1];
            const isUpdated = yield this.commentsService.updateLike(accessToken, req.params.commentId, req.body.likeStatus);
            if (!isUpdated) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_IMPLEMENTED_501);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
}
const commentsController = new CommentsController();
exports.commentsRouter.get('/:commentId', commentsController.getComment.bind(commentsController));
exports.commentsRouter.delete('/:commentId', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, ownership_validation_middleware_1.ownershipValidationMiddleware, commentsController.deleteComment.bind(commentsController));
exports.commentsRouter.put('/:commentId', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, ownership_validation_middleware_1.ownershipValidationMiddleware, exports.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, commentsController.updateComment.bind(commentsController));
exports.commentsRouter.put('/:commentId/like-status', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, likeValidation, input_validation_middleware_1.inputValidationMiddleware, commentsController.updateLikeForComment.bind(commentsController));
//# sourceMappingURL=comments-router.js.map