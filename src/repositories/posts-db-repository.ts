import { PostInputModel } from '../models/posts/PostInputModel'
import { PostViewModel } from '../models/posts/PostViewModel'
import { PostsModel } from './db'

class PostsRepository {
    async deletePosts(id: string | null) {
        let result
        if (id === null) {
            result = await PostsModel.deleteMany({})
            return result.deletedCount > 0
        }

        result = await PostsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }

    async createPost(createdPost: PostViewModel) {
        await PostsModel.create(createdPost)
    }

    async updatePost(id: string, body: PostInputModel) {
        const result = await PostsModel.updateOne({ id: id }, { $set: { content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId } })
        return result.matchedCount === 1
    }
}

export const postsRepository = new PostsRepository()