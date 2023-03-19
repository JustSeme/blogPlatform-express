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
exports.CommentsRepository = void 0;
const db_1 = require("./db");
class CommentsRepository {
    createComment(createdComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.CommentsModel.create(createdComment);
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.CommentsModel.deleteOne({ id: commentId });
            return result.deletedCount === 1;
        });
    }
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.CommentsModel.updateOne({ id: commentId }, { content: content });
            return result.matchedCount === 1;
        });
    }
    getComments(queryParams, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams;
            const filter = {
                postId: postId
            };
            const totalCount = yield db_1.CommentsModel.count(filter);
            const pagesCount = Math.ceil(totalCount / +pageSize);
            const skipCount = (+pageNumber - 1) * +pageSize;
            const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1;
            let resultedComments = yield db_1.CommentsModel.find(filter, { _id: 0, postId: 0, __v: 0 }).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber }).lean();
            return {
                pagesCount: pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: resultedComments
            };
        });
    }
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.CommentsModel.findOne({ id: commentId }).lean();
        });
    }
    setLike(likeData, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedComment = yield db_1.CommentsModel.findOne({ id: commentId });
            if (!likedComment)
                return false;
            likedComment.likesInfo.likes.push(likeData);
            yield likedComment.save();
            return true;
        });
    }
    setDislike(likeData, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dislikedComment = yield db_1.CommentsModel.findOne({ id: commentId });
            if (!dislikedComment)
                return false;
            dislikedComment.likesInfo.dislikes.push(likeData);
            yield dislikedComment.save();
            return true;
        });
    }
    setNoneLike(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likedComment = yield db_1.CommentsModel.findOne({ id: commentId });
            if (!likedComment)
                return false;
            const likeIndex = likedComment.likesInfo.likes.findIndex((like) => like.userId === userId);
            if (likeIndex > 0) {
                likedComment.likesInfo.likes.splice(likeIndex, 1);
                likedComment.save();
                return true;
            }
            const dislikeIndex = likedComment.likesInfo.dislikes.findIndex((dislike) => dislike.userId === userId);
            if (dislikeIndex > 0) {
                likedComment.likesInfo.likes.splice(dislikeIndex, 1);
                likedComment.save();
                return true;
            }
        });
    }
}
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments-db-repository.js.map