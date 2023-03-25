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
exports.PostsService = void 0;
const PostDBModel_1 = require("../../../models/posts/PostDBModel");
const posts_db_repository_1 = require("../infrastructure/posts-db-repository");
const blogs_db_repository_1 = require("../infrastructure/blogs-db-repository");
const injectable_1 = require("inversify/lib/annotation/injectable");
const jwtService_1 = require("../../../application/jwtService");
const users_db_repository_1 = require("../../../repositories/users-db-repository");
let PostsService = class PostsService {
    constructor(blogsRepository, postsRepository, jwtService, usersRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.jwtService = jwtService;
        this.usersRepository = usersRepository;
    }
    findPosts(queryParams, blogId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsDBQueryData = yield this.postsRepository.findPosts(queryParams, blogId);
            const postsViewQueryData = Object.assign(Object.assign({}, postsDBQueryData), { items: [] });
            const displayedPosts = yield this.transformLikeInfo(postsDBQueryData.items, accessToken);
            postsViewQueryData.items = displayedPosts;
            return postsViewQueryData;
        });
    }
    findPostById(postId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let findedPost = yield this.postsRepository.getPostById(postId);
            if (!findedPost) {
                return null;
            }
            if (findedPost.title === 'anyTitle1') {
                console.log(findedPost, 'findedPost');
            }
            const displayedPost = yield this.transformLikeInfo([findedPost], accessToken);
            return displayedPost[0];
        });
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
            const displayedPost = yield this.transformLikeInfo([createdPost], null);
            return displayedPost[0];
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePost(id, body);
        });
    }
    updateLike(accessToken, postId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatablePost = yield this.postsRepository.getPostById(postId);
            if (!updatablePost) {
                return false;
            }
            const jwtResult = yield this.jwtService.verifyAccessToken(accessToken);
            if (!jwtResult)
                return false;
            const userId = jwtResult.userId;
            const likedUser = yield this.usersRepository.findUserById(userId);
            const likeData = {
                createdAt: new Date().toISOString(),
                userId,
                login: likedUser.login
            };
            const likeIndex = updatablePost.extendedLikesInfo.likes.findIndex((like) => like.userId === userId);
            const dislikeIndex = updatablePost.extendedLikesInfo.dislikes.findIndex((dislike) => dislike.userId === userId);
            const noneIndex = updatablePost.extendedLikesInfo.noneEntities.findIndex((none) => none.userId === userId);
            if (status === 'None') {
                if (noneIndex > -1) {
                    // Сущность None уже существует, не нужно её обновлять
                    return true;
                }
                return this.postsRepository.setNone(updatablePost, likeIndex, dislikeIndex);
            }
            if (status === 'Like') {
                if (likeIndex > -1) {
                    // Лайк уже есть, не нужно его создавать, возвращаем true
                    return true;
                }
                if (dislikeIndex > -1 || noneIndex > -1) {
                    // Сущность дизлайка уже есть. Нужно обновить её, а не создавать новую
                    return this.postsRepository.updateToLike(updatablePost, dislikeIndex, noneIndex);
                }
                return this.postsRepository.createLike(likeData, updatablePost);
            }
            if (status === 'Dislike') {
                if (dislikeIndex > -1) {
                    // Дизлайк уже есть, не нужно его создавать
                    return true;
                }
                if (likeIndex > -1 || noneIndex > -1) {
                    // Сущность лайка уже есть. Нужно обновить её, а не создавать новую
                    return this.postsRepository.updateToDislike(updatablePost, likeIndex, noneIndex);
                }
                return this.postsRepository.createDislike(likeData, updatablePost);
            }
        });
    }
    transformLikeInfo(postsArray, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = null;
            if (accessToken) {
                const jwtResult = yield this.jwtService.verifyAccessToken(accessToken);
                userId = jwtResult ? jwtResult.userId : null;
            }
            const convertedPosts = postsArray.map((post) => {
                const likesInfoData = post.extendedLikesInfo;
                let myStatus = 'None';
                // check that post was liked current user
                if (likesInfoData.likes.some((el) => el.userId === userId)) {
                    myStatus = 'Like';
                }
                //check that post was disliked current user
                if (likesInfoData.dislikes.some((el) => el.userId === userId)) {
                    myStatus = 'Dislike';
                }
                const last3Likes = likesInfoData.likes.sort((like1, like2) => {
                    if (like1.createdAt > like2.createdAt) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }).slice(0, 3);
                let newest3Likes = last3Likes.map((like) => {
                    return {
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: like.login
                    };
                });
                const convertedPost = {
                    id: post.id,
                    content: post.content,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: likesInfoData.likes.length,
                        dislikesCount: likesInfoData.dislikes.length,
                        myStatus: myStatus,
                        newestLikes: newest3Likes
                    }
                };
                return convertedPost;
            });
            return convertedPosts;
        });
    }
};
PostsService = __decorate([
    (0, injectable_1.injectable)(),
    __metadata("design:paramtypes", [blogs_db_repository_1.BlogsRepository, posts_db_repository_1.PostsRepository, jwtService_1.JwtService, users_db_repository_1.UsersRepository])
], PostsService);
exports.PostsService = PostsService;
//# sourceMappingURL=posts-service.js.map