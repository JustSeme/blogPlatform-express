"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const posts_repository_1 = require("../repositories/posts-repository");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    const findedBlog = posts_repository_1.postsRepository.findPosts(null);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedBlog);
});
exports.postsRouter.get('/:id', (req, res) => {
    const findedBlog = posts_repository_1.postsRepository.findPosts(req.params.id);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedBlog);
});
//# sourceMappingURL=posts-router.js.map