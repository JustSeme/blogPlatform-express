import { MongoClient } from 'mongodb'
import { DeviceAuthSessionsModel } from '../models/devices/DeviceSessionsDBModel';
import { BlogViewModel } from '../models/blogs/BlogViewModel';
import { CommentDBModel } from '../models/comments/CommentDBModel';
import { PostViewModel } from '../models/posts/PostViewModel';
import { UserDBModel } from '../models/users/UserDBModel';
import { settings } from '../settings';
import { AttemptsDBModel } from '../models/auth/AttemptsDBModel';
import mongoose from 'mongoose';
import { usersSchema } from './schemas/usersSchema';
import { postsSchema } from './schemas/postsSchema';
import { blogsSchema } from './schemas/blogsSchema';

let mongoURI = settings.mongoURI

const client = new MongoClient(mongoURI)

const blogPlatformDB = client.db('blog_platform')

export const commentsCollection = blogPlatformDB.collection<CommentDBModel>('comments')
export const deviceAuthSessions = blogPlatformDB.collection<DeviceAuthSessionsModel>('deviceAuthSessions')
export const attemptsCollection = blogPlatformDB.collection<AttemptsDBModel>('attempts')

export const postsModel = mongoose.model<PostViewModel>('posts', postsSchema)
export const blogsModel = mongoose.model<BlogViewModel>('blogs', blogsSchema)
export const usersModel = mongoose.model<UserDBModel>('users', usersSchema)

export async function runDB() {
    try {
        await mongoose.connect(mongoURI);

        await client.connect();
        await client.db("blog_platform").command({ ping: 1 });
    } catch (err) {
        await mongoose.disconnect()

        await client.close();
        console.log(`can't connect to db`);
    }
}
runDB()
