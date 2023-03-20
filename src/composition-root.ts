import { JwtService } from "./application/jwtService";
import { AuthController } from "./controllers/auth-controller";
import { BlogsController } from "./controllers/blogs-controller";
import { CommentsController } from "./controllers/comments-controller";
import { PostsController } from "./controllers/posts-controller";
import { SecurityController } from "./controllers/security-controller";
import { UsersController } from "./controllers/users-controller";
import { AuthService } from "./domain/auth-service";
import { BlogsService } from "./domain/blogs-service";
import { CommentsService } from "./domain/comments-service";
import { PostsService } from "./domain/posts-service";
import { SecurityService } from "./domain/security-service";
import { BlogsRepository } from "./repositories/blogs-db-repository";
import { CommentsRepository } from "./repositories/comments-db-repository";
import { DeviceRepository } from "./repositories/device-db-repository";
import { PostsRepository } from "./repositories/posts-db-repository";
import { UsersRepository } from "./repositories/users-db-repository";

const usersRepository = new UsersRepository()
const deviceRepository = new DeviceRepository()
const blogsRepository = new BlogsRepository()
const postsRepository = new PostsRepository()
const commentsRepository = new CommentsRepository()

const authService = new AuthService(usersRepository)
const securityService = new SecurityService(deviceRepository)
//оставил export чтобы не изощряться в миддлварах
export const jwtService = new JwtService(deviceRepository)
const postsService = new PostsService(blogsRepository, postsRepository)
const commentsService = new CommentsService(jwtService, commentsRepository)
const blogsService = new BlogsService(blogsRepository)

export const authController = new AuthController(authService, jwtService)
export const usersController = new UsersController(authService)
export const securityController = new SecurityController(jwtService, securityService)
export const postsController = new PostsController(jwtService, postsService, commentsService)
export const commentsController = new CommentsController(commentsService)
export const blogsController = new BlogsController(blogsService, postsService) 