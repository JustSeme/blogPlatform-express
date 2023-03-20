import { PostInputModel } from '../models/posts/PostInputModel'
import { PostDBModel } from '../models/posts/PostDBModel'
import { PostsModel } from './db'
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class PostsRepository {
    async deletePosts(id: string) {
        let result = await PostsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }

    async createPost(createdPost: PostDBModel) {
        await PostsModel.create(createdPost)
    }

    async updatePost(id: string, body: PostInputModel) {
        const result = await PostsModel.updateOne({ id: id }, { $set: { content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId } })
        return result.matchedCount === 1
    }
}