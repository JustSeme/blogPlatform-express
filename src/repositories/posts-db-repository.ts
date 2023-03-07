import { PostInputModel } from '../models/posts/PostInputModel'
import { PostViewModel } from '../models/posts/PostViewModel'
import { postsModel } from './db'

export const postsRepository = {
    async deletePosts(id: string | null) {
        let result
        if (id === null) {
            result = await postsModel.deleteMany({})
            return result.deletedCount > 0
        }

        result = await postsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    },

    async createPost(createdPost: PostViewModel) {
        await postsModel.create(createdPost)
    },

    async updatePost(id: string, body: PostInputModel) {
        const result = await postsModel.updateOne({ id: id }, { $set: { content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId } })
        return result.matchedCount === 1
    }
}