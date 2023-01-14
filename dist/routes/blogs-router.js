"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const app_1 = require("../app");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    const findedBlog = blogs_repository_1.blogsRepository.findBlogs(null);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedBlog);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const findedBlog = blogs_repository_1.blogsRepository.findBlogs(req.params.id);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedBlog);
});
//# sourceMappingURL=blogs-router.js.map