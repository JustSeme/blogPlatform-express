"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_repository_1 = require("./repositories/videos-repository");
const videos_router_1 = require("./routes/videos-router");
const blogs_router_1 = require("./routes/blogs-router");
const blogs_repository_1 = require("./repositories/blogs-repository");
const posts_router_1 = require("./routes/posts-router");
const posts_repository_1 = require("./repositories/posts-repository");
exports.app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401
};
exports.app.use('/homework01/videos', videos_router_1.videosRouter);
exports.app.use('/homework02/blogs', blogs_router_1.blogsRouter);
exports.app.use('/homework02/posts', posts_router_1.postsRouter);
exports.app.delete('/homework01/testing/all-data', (req, res) => {
    videos_repository_1.videosRepository.deleteVideo(null);
    blogs_repository_1.blogsRepository.deleteBlog(null);
    posts_repository_1.postsRepository.deletePosts(null);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=app.js.map