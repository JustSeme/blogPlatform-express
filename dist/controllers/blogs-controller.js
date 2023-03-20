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
exports.BlogsController = void 0;
const settings_1 = require("../settings");
const blogs_query_repository_1 = require("../repositories/query/blogs-query-repository");
const posts_query_repository_1 = require("../repositories/query/posts-query-repository");
class BlogsController {
    constructor(blogsService, postsService) {
        this.blogsService = blogsService;
        this.postsService = postsService;
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedBlogs = yield blogs_query_repository_1.blogsQueryRepository.findBlogs(req.query);
            if (!findedBlogs.items.length) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedBlogs);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.id);
            if (!findedBlog) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedBlog);
        });
    }
    getPostsForBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedPostsForBlog = yield posts_query_repository_1.postsQueryRepository.findPosts(req.query, req.params.blogId);
            if (!findedPostsForBlog.items.length) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.send(findedPostsForBlog);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield this.blogsService.createBlog(req.body);
            res
                .status(settings_1.HTTP_STATUSES.CREATED_201)
                .send(createdBlog);
        });
    }
    createPostForBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield this.postsService.createPost(req.body, req.params.blogId);
            res
                .status(settings_1.HTTP_STATUSES.CREATED_201)
                .send(createdPost);
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield this.blogsService.updateBlog(req.params.id, req.body);
            if (!isUpdated) {
                res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.blogsService.deleteBlog(req.params.id);
            if (isDeleted) {
                res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
                return;
            }
            res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
        });
    }
}
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogs-controller.js.map