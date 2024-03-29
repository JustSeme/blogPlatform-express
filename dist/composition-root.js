"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const jwtService_1 = require("./application/jwtService");
const auth_controller_1 = require("./features/auth/api/controllers/auth-controller");
const blogs_controller_1 = require("./features/blogs/api/controllers/blogs-controller");
const comments_controller_1 = require("./features/blogs/api/controllers/comments-controller");
const posts_controller_1 = require("./features/blogs/api/controllers/posts-controller");
const security_controller_1 = require("./features/security/api/controllers/security-controller");
const users_controller_1 = require("./features/auth/api/controllers/users-controller");
const auth_service_1 = require("./features/auth/application/auth-service");
const blogs_service_1 = require("./features/blogs/application/blogs-service");
const comments_service_1 = require("./features/blogs/application/comments-service");
const posts_service_1 = require("./features/blogs/application/posts-service");
const security_service_1 = require("./features/security/application/security-service");
const blogs_db_repository_1 = require("./features/blogs/infrastructure/blogs-db-repository");
const comments_db_repository_1 = require("./features/blogs/infrastructure/comments-db-repository");
const device_db_repository_1 = require("./features/security/infrastructure/device-db-repository");
const posts_db_repository_1 = require("./features/blogs/infrastructure/posts-db-repository");
const users_db_repository_1 = require("./features/auth/infrastructure/users-db-repository");
const container_1 = require("inversify/lib/container/container");
exports.container = new container_1.Container();
//controllers
exports.container.bind(auth_controller_1.AuthController).to(auth_controller_1.AuthController);
exports.container.bind(users_controller_1.UsersController).to(users_controller_1.UsersController);
exports.container.bind(security_controller_1.SecurityController).to(security_controller_1.SecurityController);
exports.container.bind(posts_controller_1.PostsController).to(posts_controller_1.PostsController);
exports.container.bind(comments_controller_1.CommentsController).to(comments_controller_1.CommentsController);
exports.container.bind(blogs_controller_1.BlogsController).to(blogs_controller_1.BlogsController);
//services
exports.container.bind(auth_service_1.AuthService).to(auth_service_1.AuthService);
exports.container.bind(security_service_1.SecurityService).to(security_service_1.SecurityService);
exports.container.bind(jwtService_1.JwtService).to(jwtService_1.JwtService);
exports.container.bind(posts_service_1.PostsService).to(posts_service_1.PostsService);
exports.container.bind(comments_service_1.CommentsService).to(comments_service_1.CommentsService);
exports.container.bind(blogs_service_1.BlogsService).to(blogs_service_1.BlogsService);
// repositories
exports.container.bind(users_db_repository_1.UsersRepository).to(users_db_repository_1.UsersRepository);
exports.container.bind(device_db_repository_1.DeviceRepository).to(device_db_repository_1.DeviceRepository);
exports.container.bind(blogs_db_repository_1.BlogsRepository).to(blogs_db_repository_1.BlogsRepository);
exports.container.bind(posts_db_repository_1.PostsRepository).to(posts_db_repository_1.PostsRepository);
exports.container.bind(comments_db_repository_1.CommentsRepository).to(comments_db_repository_1.CommentsRepository);
//# sourceMappingURL=composition-root.js.map