import { MongoClient } from 'mongodb'
import { BlogViewModel } from '../models/blogs/BlogViewModel';
import { PostViewModel } from '../models/posts/PostViewModel';
import { UserDBModel } from '../models/users/UserDBModel';
import { settings } from '../settings';

let mongoURI = settings.mongoURI

const client = new MongoClient(mongoURI)

const blogPlatformDB = client.db('blog_platform')

export const postsCollection = blogPlatformDB.collection<PostViewModel>('posts')
export const blogsCollection = blogPlatformDB.collection<BlogViewModel>('blogs')
export const usersCollection = blogPlatformDB.collection<UserDBModel>('users')

export async function runDB() {
    try {
        await client.connect();
        await client.db("blog_platform").command({ ping: 1 });
        console.log("Connected successfully to MongoDB server");
    } catch (err) {
        await client.close();
        console.log(err);
    }
}
runDB()
