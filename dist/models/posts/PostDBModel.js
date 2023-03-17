"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDBModel = void 0;
const uuid_1 = require("uuid");
//data transfer object
class PostDBModel {
    constructor(title, shortDescription, content, blogId, blogName) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.id = (0, uuid_1.v4)();
        this.createdAt = new Date().toISOString();
    }
}
exports.PostDBModel = PostDBModel;
//# sourceMappingURL=PostDBModel.js.map