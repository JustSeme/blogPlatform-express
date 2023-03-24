import { PostInputModel } from '../models/posts/PostInputModel'
import { PostDBModel } from '../models/posts/PostDBModel'
import { PostsRepository } from '../repositories/posts-db-repository'
import { BlogsRepository } from '../repositories/blogs-db-repository'
import { injectable } from 'inversify/lib/annotation/injectable';
import { LikeType } from '../models/comments/LikeInputModel';
import { JwtService } from '../application/jwtService';
import { LikeObjectType } from '../models/comments/CommentDBModel';

@injectable()
export class PostsService {
    constructor(protected blogsRepository: BlogsRepository, protected postsRepository: PostsRepository, protected jwtService: JwtService) { }

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

    async updateLike(accessToken: string, postId: string, status: LikeType) {
        const updatingPost = await this.postsRepository.getPostById(postId)
        if (!updatingPost) {
            return false
        }

        const jwtResult = await this.jwtService.verifyAccessToken(accessToken)
        if (!jwtResult) return false

        const userId = jwtResult.userId

        const likeData: LikeObjectType = {
            userId,
            createdAt: new Date().toISOString()
        }

        const likeIndex = updatingPost.extendedLikesInfo.likes.findIndex((like: LikeObjectType) => like.userId === userId)
        const dislikeIndex = updatingPost.extendedLikesInfo.dislikes.findIndex((dislike: LikeObjectType) => dislike.userId === userId)
        const noneIndex = updatingPost.extendedLikesInfo.noneEntities.findIndex((none: LikeObjectType) => none.userId === userId)

        if (status === 'None') {
            if (noneIndex > -1) {
                // Сущность None уже существует, не нужно её обновлять
                return true
            }
            return this.postsRepository.setNone(updatingPost, likeIndex, dislikeIndex)
        }

        if (status === 'Like') {
            if (likeIndex > -1) {
                // Лайк уже есть, не нужно его создавать, возвращаем true
                return true
            }

            if (dislikeIndex > -1 || noneIndex > -1) {
                // Сущность дизлайка уже есть. Нужно обновить её, а не создавать новую
                return this.postsRepository.updateLikeInfo()
            }

            return this.postsRepository.createLike(likeData, postId)
        }

        if (status === 'Dislike') {
            if (dislikeIndex > -1) {
                // Дизлайк уже есть, не нужно его создавать
                return true
            }

            if (likeIndex > -1 || noneIndex > -1) {
                // Сущность лайка уже есть. Нужно обновить её, а не создавать новую
                return this.postsRepository.updateDislikeInfo()
            }

            return this.postsRepository.createDislike(likeData, postId)
        }
    }
}