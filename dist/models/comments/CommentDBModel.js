"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentDBModel = void 0;
const uuid_1 = require("uuid");
class CommentDBModel {
    constructor(content, postId, userId, userLogin) {
        this.content = content;
        this.postId = postId;
        this.id = (0, uuid_1.v4)();
        this.createdAt = new Date().toISOString();
        this.commentatorInfo = {
            userId,
            userLogin
        };
        this.likesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None'
        };
    }
}
exports.CommentDBModel = CommentDBModel;
//# sourceMappingURL=CommentDBModel.js.map