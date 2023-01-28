import { PostInputModel } from '../models/posts/PostInputModel'
import { PostViewModel } from '../models/posts/PostViewModel'
import { postsRepository } from '../repositories/posts-db-repository'

export const postsService = {
    async findPosts(id: string | null): Promise<PostViewModel | PostViewModel[] | null> {
        return await postsRepository.findPosts(id)
    },

    async deletePosts(id: string | null) {
        return await postsRepository.deletePosts(id)
    },

    async createPost(body: PostInputModel, blogId: string | null): Promise<PostViewModel> {
        const createdPost: PostViewModel = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId ? blogId : body.blogId,
            blogName: 'I do not know how to associate a blogName with real data',
            createdAt: new Date().toISOString(),
        }

        await postsRepository.createPost(createdPost)

        //@ts-ignore
        delete createdPost._id
        return createdPost
    },

    async updatePost(id: string, body: PostInputModel) {
        return await postsRepository.updatePost(id, body)
    }
}