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
exports.app = exports.HTTP_STATUSES = exports.baseURL = exports.settings = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const videos_in_memory_repository_1 = require("./repositories/videos-in-memory-repository");
const videos_router_1 = require("./routes/videos-router");
const blogs_router_1 = require("./features/blogs/api/routes/blogs-router");
const posts_router_1 = require("./features/blogs/api/routes/posts-router");
const users_router_1 = require("./features/users/api/routes/users-router");
const auth_router_1 = require("./routes/auth-router");
const comments_router_1 = require("./features/blogs/api/routes/comments-router");
const security_router_1 = require("./routes/security-router");
const db_1 = require("./repositories/db");
const username = "justSeme";
const password = "RMMXpX1hUlXqbKED";
let mongoDBname = 'blog_platform';
exports.settings = {
    mongoURI: process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/${mongoDBname}?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret',
    PORT: process.env.PORT || 3000,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN || 'kepxep69@gmail.com',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || 'gpllbohdhqcrdvnh',
    ACCESS_TOKEN_EXPIRE_TIME: '5min',
    REFRESH_TOKEN_EXPIRE_TIME: '20min',
};
exports.baseURL = '/homeworks/';
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    TOO_MANY_REQUESTS_429: 429,
    NOT_IMPLEMENTED_501: 501
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
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.app.delete('/homeworks/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.PostsModel.deleteMany({});
    yield db_1.BlogsModel.deleteMany({});
    yield db_1.UsersModel.deleteMany({});
    yield db_1.AttemptsModel.deleteMany({});
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.app.get(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`
        <h1>Привет! Это мой учебный проект по бэкенду</h1>
        <h2>Я пока не реализовал способ демонстриации работы моего API, но позже обязательно это сделаю.</h2>
        <h2>Оцените качество моей работы на <a href='https://github.com/JustSeme/homeworks'>гитхабе</a>. Так же чтобы проверить работу можно e2e тестами, реализованными в проекте</h2>
    `);
}));
//# sourceMappingURL=settings.js.map