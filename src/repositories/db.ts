import { DeviceAuthSessionsModel } from '../features/security/domain/entities/DeviceSessionsModel';
import { BlogViewModel } from '../features/blogs/api/models/BlogViewModel';
import { CommentDBModel } from '../features/blogs/domain/entities/CommentDBModel';
import { PostDBModel } from '../features/blogs/domain/entities/PostDBModel';
import { UserDBModel } from '../features/auth/domain/entities/UserDBModel';
import { settings } from '../settings';
import { AttemptsDBModel } from '../features/security/domain/entities/AttemptsDBModel';
import mongoose from 'mongoose';
import { usersSchema } from '../features/auth/domain/entities/usersSchema';
import { postsSchema } from '../features/blogs/domain/entities/postsSchema';
import { blogsSchema } from '../features/blogs/domain/entities/blogsSchema';
import { commentsSchema } from '../features/blogs/domain/entities/commentsSchema';
import { deviceAuthSessionsSchema } from '../features/security/domain/entities/deviceAuthSessionsSchema';
import { attemptsSchema } from '../features/security/domain/entities/attemptsSchema';

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
