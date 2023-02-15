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
const posts_router_1 = require("./routes/posts-router");
const db_1 = require("./repositories/db");
const users_router_1 = require("./routes/users-router");
const auth_router_1 = require("./routes/auth-router");
const posts_service_1 = require("./domain/posts-service");
const blogs_service_1 = require("./domain/blogs-service");
const auth_service_1 = require("./domain/auth-service");
const settings_1 = require("./settings");
const comments_router_1 = require("./routes/comments-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.app = (0, express_1.default)();
const port = settings_1.settings.PORT;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use((0, cookie_parser_1.default)());
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
};
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDB)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
exports.app.use('/homeworks/videos', videos_router_1.videosRouter);
exports.app.use('/homeworks/blogs', blogs_router_1.blogsRouter);
exports.app.use('/homeworks/posts', posts_router_1.postsRouter);
exports.app.use('/homeworks/users', users_router_1.usersRouter);
exports.app.use('/homeworks/auth', auth_router_1.authRouter);
exports.app.use('/homeworks/comments', comments_router_1.commentsRouter);
exports.app.delete('/homework01/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield videos_in_memory_repository_1.videosRepository.deleteVideo(null);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.app.delete('/homeworks/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield posts_service_1.postsService.deletePosts(null);
    yield blogs_service_1.blogsService.deleteBlog(null);
    yield auth_service_1.authService.deleteUsers(null);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
}));
startApp();
//# sourceMappingURL=app.js.map