import { PostInputModel } from '../models/posts/PostInputModel'
import { PostViewModel } from '../models/posts/PostViewModel'
import { postsCollection } from './db'

export const postsRepository = {
    async findPosts(id: string | null): Promise<PostViewModel | PostViewModel[] | null> {
        if(id === null) {
            return await postsCollection.find({}, { projection: { _id: 0 } }).toArray()
        }
        return await postsCollection.findOne({id: id}, { projection: { _id: 0 } })
    },

    async deletePosts(id: string | null) {
        let result
        if(id === null) {
            result = await postsCollection.deleteMany({})
            return result.deletedCount > 0
        }
        result = await postsCollection.deleteOne({id: id})
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

        await postsCollection.insertOne(createdPost)

        //@ts-ignore
        delete createdPost._id
        return createdPost
    },

    async updatePost(id: string, body: PostInputModel) {
        const result = await postsCollection.updateOne({id: id}, {$set: {content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId}})

        return result.matchedCount === 1
    }
}