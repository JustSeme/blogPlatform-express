import { PostInputModel } from '../models/posts/PostInputModel'
import { PostViewModel } from '../models/posts/PostViewModel'
import { client } from './db'

export const postsRepository = {
    async findPosts(id: string | null): Promise<PostViewModel | PostViewModel[] | null> {
        if(id === null) {
            return await client.db('blog_platform').collection<PostViewModel>('posts').find({}).toArray()
        }
        return await client.db('blog_platform').collection<PostViewModel>('posts').findOne({id: id})
    },

    async deletePosts(id: string | null) {
        let result
        if(id === null) {
            result = await client.db('blog_platform').collection<PostViewModel>('posts').deleteMany({})
            return result.deletedCount > 0
        }
        result = await client.db('blog_platform').collection<PostViewModel>('posts').deleteOne({id: id})
        return result.deletedCount === 1
    },

    async createPost(body: PostInputModel): Promise<PostViewModel> {
        const createdPost: PostViewModel = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: 'I do not know how to associate a blogName with real data',
            createdAt: new Date().toISOString(),
        }

        await client.db('blog_platform').collection<PostViewModel>('posts').insertOne(createdPost)

        return createdPost
    },

    async updatePost(id: string, body: PostInputModel) {
        const result = await client.db('blog_platform').collection<PostViewModel>('posts')
            .updateOne({id: id}, {$set: {content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId}})

        return result.matchedCount === 1
    }
}