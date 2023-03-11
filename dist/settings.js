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
exports.app = exports.settings = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const videos_in_memory_repository_1 = require("./repositories/videos-in-memory-repository");
const videos_router_1 = require("./routes/videos-router");
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const users_router_1 = require("./routes/users-router");
const auth_router_1 = require("./routes/auth-router");
const posts_service_1 = require("./domain/posts-service");
const blogs_service_1 = require("./domain/blogs-service");
const auth_service_1 = require("./domain/auth-service");
const comments_router_1 = require("./routes/comments-router");
const security_router_1 = require("./routes/security-router");
const attempts_db_repository_1 = require("./repositories/attempts-db-repository");
const app_1 = require("./app");
const username = "justSeme";
const password = "RMMXpX1hUlXqbKED";
let mongoDBname = 'blog_platform';
exports.settings = {
    mongoURI: process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/${mongoDBname}?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret',
    PORT: process.env.PORT || 3000,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN || 'kepxep69@gmail.com',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || 'gpllbohdhqcrdvnh'
};
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use((0, cookie_parser_1.default)());
exports.app.set('trust proxy', true);
exports.app.use('/homeworks/videos', videos_router_1.videosRouter);
exports.app.use('/homeworks/blogs', blogs_router_1.blogsRouter);
exports.app.use('/homeworks/posts', posts_router_1.postsRouter);
exports.app.use('/homeworks/users', users_router_1.usersRouter);
exports.app.use('/homeworks/auth', auth_router_1.authRouter);
exports.app.use('/homeworks/comments', comments_router_1.commentsRouter);
exports.app.use('/homeworks/security', security_router_1.securityRouter);
exports.app.delete('/homework01/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield videos_in_memory_repository_1.videosRepository.deleteVideo(null);
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.app.delete('/homeworks/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield posts_service_1.postsService.deletePosts(null);
    yield blogs_service_1.blogsService.deleteBlog(null);
    yield auth_service_1.authService.deleteUsers(null);
    yield attempts_db_repository_1.attemptsRepository.clearAllAttempts();
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
}));
//# sourceMappingURL=settings.js.map