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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_in_memory_repository_1 = require("./repositories/videos-in-memory-repository");
const videos_router_1 = require("./routes/videos-router");
const blogs_router_1 = require("./routes/blogs-router");
const blogs_db_repository_1 = require("./repositories/blogs-db-repository");
const posts_router_1 = require("./routes/posts-router");
const posts_db_repository_1 = require("./repositories/posts-db-repository");
const db_1 = require("./repositories/db");
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3000;
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
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDB)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
exports.app.use('/homework01/videos', videos_router_1.videosRouter);
exports.app.use('/homework02/blogs', blogs_router_1.blogsRouter);
exports.app.use('/homework02/posts', posts_router_1.postsRouter);
exports.app.delete('/homework01/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield videos_in_memory_repository_1.videosRepository.deleteVideo(null);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.app.delete('/homework02/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield posts_db_repository_1.postsRepository.deletePosts(null);
    yield blogs_db_repository_1.blogsRepository.deleteBlog(null);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
}));
startApp();
//# sourceMappingURL=app.js.map