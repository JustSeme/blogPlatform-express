import { PostInputModel } from '../models/posts/PostInputModel'
import { PostViewModel } from '../models/posts/PostViewModel'
import { postsCollection } from './db'

export const postsRepository = {
    async deletePosts(id: string | null) {
        let result
        if(id === null) {
            result = await postsCollection.deleteMany({})
            return result.deletedCount > 0
        }
        
        result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async createPost(createdPost: PostViewModel) {
        await postsCollection.insertOne(createdPost)
    },

    async updatePost(id: string, body: PostInputModel) {
        const result = await postsCollection.updateOne({id: id}, {$set: {content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId}})
        return result.matchedCount === 1
    }
}