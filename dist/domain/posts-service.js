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
exports.PostsService = void 0;
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
class PostsService {
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.deletePosts(id);
        });
    }
    createPost(body, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogById = yield blogs_db_repository_1.blogsRepository.findBlogById(blogId ? blogId : body.blogId);
            const createdPost = {
                id: Date.now().toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId ? blogId : body.blogId,
                blogName: (blogById === null || blogById === void 0 ? void 0 : blogById.name) ? blogById === null || blogById === void 0 ? void 0 : blogById.name : 'not found',
                createdAt: new Date().toISOString(),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None'
                }
            };
            yield posts_db_repository_1.postsRepository.createPost(createdPost);
            return createdPost;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.updatePost(id, body);
        });
    }
}
exports.PostsService = PostsService;
//# sourceMappingURL=posts-service.js.map