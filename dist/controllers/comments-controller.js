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
exports.CommentsController = void 0;
const settings_1 = require("../settings");
class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const findedComment = yield this.commentsService.getCommentById(req.params.commentId, accessToken);
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
exports.CommentsController = CommentsController;
//# sourceMappingURL=comments-controller.js.map