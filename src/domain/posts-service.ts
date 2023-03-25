import { PostInputModel } from '../models/posts/PostInputModel'
import { ExtendedLikeObjectType, PostDBModel, PostsWithQueryOutputModel } from '../models/posts/PostDBModel'
import { PostsRepository } from '../repositories/posts-db-repository'
import { BlogsRepository } from '../repositories/blogs-db-repository'
import { injectable } from 'inversify/lib/annotation/injectable';
import { LikeType } from '../models/comments/LikeInputModel';
import { JwtService } from '../application/jwtService';
import { ReadPostsQueryParams } from '../models/posts/ReadPostsQuery';
import { PostsViewModel } from '../models/posts/PostViewModel';
import { UsersRepository } from '../repositories/users-db-repository';

@injectable()
export class PostsService {
    constructor(protected blogsRepository: BlogsRepository, protected postsRepository: PostsRepository, protected jwtService: JwtService, protected usersRepository: UsersRepository) { }

    async findPosts(queryParams: ReadPostsQueryParams, blogId: string | null, accessToken: string | null) {
        const postsDBQueryData = await this.postsRepository.findPosts(queryParams, blogId)

        const postsViewQueryData: PostsWithQueryOutputModel = { ...postsDBQueryData, items: [] }

        const displayedPosts = await this.transformLikeInfo(postsDBQueryData.items, accessToken)
        postsViewQueryData.items = displayedPosts

        return postsViewQueryData
    }

    async findPostById(postId: string, accessToken: string | null): Promise<PostsViewModel | null> {
        let findedPost = await this.postsRepository.getPostById(postId)
        if (!findedPost) {
            return null
        }

        const displayedPost = await this.transformLikeInfo([findedPost], accessToken)
        return displayedPost[0]
    }

    async deletePosts(id: string) {
        return await this.postsRepository.deletePosts(id)
    }

    async createPost(body: PostInputModel, blogId: string | null): Promise<PostsViewModel> {
        const blogById = await this.blogsRepository.findBlogById(blogId ? blogId : body.blogId)

        const createdPost: PostDBModel = new PostDBModel(
            body.title,
            body.shortDescription,
            body.content,
            blogId ? blogId : body.blogId,
            blogById?.name ? blogById?.name : 'not found',
        )

        await this.postsRepository.createPost(createdPost)

        const displayedPost = await this.transformLikeInfo([createdPost], null)
        return displayedPost[0]
    }

    async updatePost(id: string, body: PostInputModel) {
        return await this.postsRepository.updatePost(id, body)
    }

    async updateLike(accessToken: string, postId: string, status: LikeType) {
        const updatablePost = await this.postsRepository.getPostById(postId)
        if (!updatablePost) {
            return false
        }

        const jwtResult = await this.jwtService.verifyAccessToken(accessToken)
        if (!jwtResult) return false

        const userId = jwtResult.userId

        const likedUser = await this.usersRepository.findUserById(userId)
        const likeData: ExtendedLikeObjectType = {
            createdAt: new Date().toISOString(),
            userId,
            login: likedUser!.login
        }

        const likeIndex = updatablePost.extendedLikesInfo.likes.findIndex((like: ExtendedLikeObjectType) => like.userId === userId)
        const dislikeIndex = updatablePost.extendedLikesInfo.dislikes.findIndex((dislike: ExtendedLikeObjectType) => dislike.userId === userId)
        const noneIndex = updatablePost.extendedLikesInfo.noneEntities.findIndex((none: ExtendedLikeObjectType) => none.userId === userId)

        if (status === 'None') {
            if (noneIndex > -1) {
                // Сущность None уже существует, не нужно её обновлять
                return true
            }
            return this.postsRepository.setNone(updatablePost, likeIndex, dislikeIndex)
        }

        if (status === 'Like') {
            if (likeIndex > -1) {
                // Лайк уже есть, не нужно его создавать, возвращаем true
                return true
            }

            if (dislikeIndex > -1 || noneIndex > -1) {
                // Сущность дизлайка уже есть. Нужно обновить её, а не создавать новую
                return this.postsRepository.updateToLike(updatablePost, dislikeIndex, noneIndex)
            }

            return this.postsRepository.createLike(likeData, updatablePost)
        }

        if (status === 'Dislike') {
            if (dislikeIndex > -1) {
                // Дизлайк уже есть, не нужно его создавать
                return true
            }

            if (likeIndex > -1 || noneIndex > -1) {
                // Сущность лайка уже есть. Нужно обновить её, а не создавать новую
                return this.postsRepository.updateToDislike(updatablePost, likeIndex, noneIndex)
            }

            return this.postsRepository.createDislike(likeData, updatablePost)
        }
    }

    async transformLikeInfo(postsArray: PostDBModel[], accessToken: string | null): Promise<PostsViewModel[]> {
        let userId: string | null = null
        if (accessToken) {
            const jwtResult = await this.jwtService.verifyAccessToken(accessToken)
            userId = jwtResult ? jwtResult.userId : null
        }

        const convertedPosts = postsArray.map((post: PostDBModel) => {
            const likesInfoData = post.extendedLikesInfo

            let myStatus: LikeType = 'None'

            // check that post was liked current user
            if (likesInfoData.likes.some((el: ExtendedLikeObjectType) => el.userId === userId)) {
                myStatus = 'Like'
            }

            //check that post was disliked current user
            if (likesInfoData.dislikes.some((el: ExtendedLikeObjectType) => el.userId === userId)) {
                myStatus = 'Dislike'
            }

            const last3Likes = likesInfoData.likes.sort((like1, like2) => {
                if (like1.createdAt > like2.createdAt) {
                    return 1
                } else {
                    return -1
                }
            }).slice(0, 3)

            let newest3Likes = last3Likes.map((like: ExtendedLikeObjectType) => {
                return {
                    addedAt: like.createdAt,
                    userId: like.userId,
                    login: like.login
                }
            })

            const convertedPost: PostsViewModel = {
                id: post.id,
                content: post.content,
                title: post.title,
                shortDescription: post.shortDescription,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likesInfoData.likes.length,
                    dislikesCount: likesInfoData.dislikes.length,
                    myStatus: myStatus,
                    newestLikes: newest3Likes
                }
            }

            return convertedPost
        })

        return convertedPosts
    }
}