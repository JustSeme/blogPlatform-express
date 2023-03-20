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
const PostDBModel_1 = require("../models/posts/PostDBModel");
class PostsService {
    constructor(blogsRepository, postsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
    }
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePosts(id);
        });
    }
    createPost(body, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogById = yield this.blogsRepository.findBlogById(blogId ? blogId : body.blogId);
            const createdPost = new PostDBModel_1.PostDBModel(body.title, body.shortDescription, body.content, blogId ? blogId : body.blogId, (blogById === null || blogById === void 0 ? void 0 : blogById.name) ? blogById === null || blogById === void 0 ? void 0 : blogById.name : 'not found');
            yield this.postsRepository.createPost(createdPost);
            return createdPost;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePost(id, body);
        });
    }
}
exports.PostsService = PostsService;
//# sourceMappingURL=posts-service.js.map