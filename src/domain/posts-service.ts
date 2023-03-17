import { PostInputModel } from '../models/posts/PostInputModel'
import { PostDBModel } from '../models/posts/PostViewModel'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'

export class PostsService {
    async deletePosts(id: string | null) {
        return await postsRepository.deletePosts(id)
    }

    async createPost(body: PostInputModel, blogId: string | null): Promise<PostDBModel> {
        const blogById = await blogsRepository.findBlogById(blogId ? blogId : body.blogId)

        const createdPost: PostDBModel = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId ? blogId : body.blogId,
            blogName: blogById?.name ? blogById?.name : 'not found',
            createdAt: new Date().toISOString(),
        }

        await postsRepository.createPost(createdPost)

        return createdPost
    }

    async updatePost(id: string, body: PostInputModel) {
        return await postsRepository.updatePost(id, body)
    }
}


//Оставил это чтобы не делать костыли для /testing-delete-all-data
export const postsService = new PostsService()