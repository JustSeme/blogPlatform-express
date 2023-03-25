import { DeviceAuthSessionsModel } from '../models/devices/DeviceSessionsModel';
import { BlogViewModel } from '../features/blogs/api/models/BlogViewModel';
import { CommentDBModel } from '../features/blogs/domain/entities/CommentDBModel';
import { PostDBModel } from '../features/blogs/domain/entities/PostDBModel';
import { UserDBModel } from '../models/users/UserDBModel';
import { settings } from '../settings';
import { AttemptsDBModel } from '../models/auth/AttemptsDBModel';
import mongoose from 'mongoose';
import { usersSchema } from './schemas/usersSchema';
import { postsSchema } from '../features/blogs/domain/entities/postsSchema';
import { blogsSchema } from '../features/blogs/domain/entities/blogsSchema';
import { commentsSchema } from '../features/blogs/domain/entities/commentsSchema';
import { deviceAuthSessionsSchema } from './schemas/deviceAuthSessionsSchema';
import { attemptsSchema } from './schemas/attemptsSchema';

let mongoURI = settings.mongoURI

export const PostsModel = mongoose.model<PostDBModel>('posts', postsSchema)
export const BlogsModel = mongoose.model<BlogViewModel>('blogs', blogsSchema)
export const UsersModel = mongoose.model<UserDBModel>('users', usersSchema)
export const CommentsModel = mongoose.model<CommentDBModel>('comments', commentsSchema)
export const DeviceAuthSessionsDBModel = mongoose.model<DeviceAuthSessionsModel>('deviceAuthSessions', deviceAuthSessionsSchema)
export const AttemptsModel = mongoose.model<AttemptsDBModel>('attempts', attemptsSchema)

export async function runDB() {
    try {
        await mongoose.connect(mongoURI);
    } catch (err) {
        await mongoose.disconnect()
    }
}
runDB()
