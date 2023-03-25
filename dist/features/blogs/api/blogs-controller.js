"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const settings_1 = require("../../../settings");
const blogs_service_1 = require("../../../domain/blogs-service");
const blogs_query_repository_1 = require("../../../repositories/query/blogs-query-repository");
const posts_service_1 = require("../../../domain/posts-service");
const injectable_1 = require("inversify/lib/annotation/injectable");
let BlogsController = class BlogsController {
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
            const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
            const findedPostsForBlog = yield this.postsService.findPosts(req.query, req.params.blogId, accessToken);
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
};
BlogsController = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService, posts_service_1.PostsService])
], BlogsController);
exports.BlogsController = BlogsController;
//# sourceMappingURL=blogs-controller.js.map