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
exports.postsService = void 0;
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
exports.postsService = {
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.deletePosts(id);
        });
    },
    createPost(body, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogById = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId ? blogId : body.blogId);
            const createdPost = {
                id: Date.now().toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId ? blogId : body.blogId,
                blogName: blogById.name,
                createdAt: new Date().toISOString(),
            };
            yield posts_db_repository_1.postsRepository.createPost(createdPost);
            //@ts-ignore
            delete createdPost._id;
            return createdPost;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.updatePost(id, body);
        });
    }
};
//# sourceMappingURL=posts-service.js.map