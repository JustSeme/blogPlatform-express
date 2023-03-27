import { PostInputModel } from '../application/dto/PostInputModel'
import { ExtendedLikeObjectType, PostDBModel } from '../domain/entities/PostDBModel'
import { PostsModel } from '../../../repositories/db'
import { injectable } from 'inversify/lib/annotation/injectable';
import { Document } from 'mongoose';
import { ReadPostsQueryParams } from '../api/models/ReadPostsQuery';

@injectable()
export class PostsRepository {
    async findPosts(queryParams: ReadPostsQueryParams, blogId: string | null) {
        const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams

        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId
        }

        const totalCount = await PostsModel.count(filter)
        const pagesCount = Math.ceil(totalCount / +pageSize)

        const skipCount = (+pageNumber - 1) * +pageSize
        const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1
        let resultedPosts = await PostsModel.find(filter, { _id: 0, __v: 0 }).skip(skipCount).limit(+pageSize).sort({ [sortBy]: sortDirectionNumber }).lean()

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: totalCount,
            items: resultedPosts
        }
    }

    async getPostById(postId: string) {
        return PostsModel.findOne({ id: postId })
    }

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

    async createLike(likeData: ExtendedLikeObjectType, likedPost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>) {
        likedPost.extendedLikesInfo.likes.push(likeData)

        await likedPost.save()
        return true
    }

    async createDislike(likeData: ExtendedLikeObjectType, dislikedPost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>) {
        dislikedPost.extendedLikesInfo.dislikes.push(likeData)

        await dislikedPost.save()
        return true
    }

    async setNone(editablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, likeIndex: number, dislikeIndex: number) {
        if (likeIndex > -1) {
            const noneData = editablePost.extendedLikesInfo.likes.splice(likeIndex, 1)[0]
            editablePost.extendedLikesInfo.noneEntities.push(noneData)
        }

        if (dislikeIndex > -1) {
            const noneData = editablePost.extendedLikesInfo.dislikes.splice(dislikeIndex, 1)[0]
            editablePost.extendedLikesInfo.noneEntities.push(noneData)
        }

        await editablePost.save()
        return true
    }

    async updateToLike(updatablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, dislikeIndex: number, noneIndex: number) {
        if (noneIndex > -1) {
            const likeData = updatablePost.extendedLikesInfo.noneEntities.splice(noneIndex, 1)[0]
            updatablePost.extendedLikesInfo.likes.push(likeData)
        }

        if (dislikeIndex > -1) {
            const likeData = updatablePost.extendedLikesInfo.dislikes.splice(dislikeIndex, 1)[0]
            updatablePost.extendedLikesInfo.likes.push(likeData)
        }

        await updatablePost.save()
        return true
    }

    async updateToDislike(updatablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, likeIndex: number, noneIndex: number) {
        if (noneIndex > -1) {
            const dislikeData = updatablePost.extendedLikesInfo.noneEntities.splice(noneIndex, 1)[0]
            updatablePost.extendedLikesInfo.dislikes.push(dislikeData)
        }

        if (likeIndex > -1) {
            const dislikeData = updatablePost.extendedLikesInfo.likes.splice(likeIndex, 1)[0]
            updatablePost.extendedLikesInfo.dislikes.push(dislikeData)
        }

        await updatablePost.save()
        return true
    }
}