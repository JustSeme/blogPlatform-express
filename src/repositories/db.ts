import { MongoClient } from 'mongodb'
import { BlogViewModel } from '../models/blogs/BlogViewModel';
import { PostViewModel } from '../models/posts/PostViewModel';

const username = "justSeme"
const password = "RMMXpX1hUlXqbKED"

let mongoURI = process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(mongoURI)

const blogPlatformDB = client.db('blog_platform')

export const postsCollection = blogPlatformDB.collection<PostViewModel>('posts')
export const blogsCollection = blogPlatformDB.collection<BlogViewModel>('blogs')

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
