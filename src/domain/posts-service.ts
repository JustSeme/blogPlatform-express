import { PostInputModel } from '../models/posts/PostInputModel'
import { PostDBModel } from '../models/posts/PostDBModel'
import { PostsRepository } from '../repositories/posts-db-repository'
import { BlogsRepository } from '../repositories/blogs-db-repository'
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class PostsService {
    constructor(protected blogsRepository: BlogsRepository, protected postsRepository: PostsRepository) { }

    async deletePosts(id: string) {
        return await this.postsRepository.deletePosts(id)
    }

    async createPost(body: PostInputModel, blogId: string | null): Promise<PostDBModel> {
        const blogById = await this.blogsRepository.findBlogById(blogId ? blogId : body.blogId)

        const createdPost: PostDBModel = new PostDBModel(
            body.title,
            body.shortDescription,
            body.content,
            blogId ? blogId : body.blogId,
            blogById?.name ? blogById?.name : 'not found',
        )

        await this.postsRepository.createPost(createdPost)

        return createdPost
    }

    async updatePost(id: string, body: PostInputModel) {
        return await this.postsRepository.updatePost(id, body)
    }
}