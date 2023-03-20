import 'reflect-metadata'
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
import { Container } from "inversify/lib/container/container";

export const container = new Container()

container.bind<AuthController>(AuthController).to(AuthController)
container.bind<UsersController>(UsersController).to(UsersController)
container.bind<SecurityController>(SecurityController).to(SecurityController)
container.bind<PostsController>(PostsController).to(PostsController)
container.bind<CommentsController>(CommentsController).to(CommentsController)
container.bind<BlogsController>(BlogsController).to(BlogsController)

container.bind<AuthService>(AuthService).to(AuthService)
container.bind<SecurityService>(SecurityService).to(SecurityService)
container.bind<JwtService>(JwtService).to(JwtService)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<BlogsService>(BlogsService).to(BlogsService)

container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
container.bind<DeviceRepository>(DeviceRepository).to(DeviceRepository)
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository)
container.bind<PostsRepository>(PostsRepository).to(PostsRepository)
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)