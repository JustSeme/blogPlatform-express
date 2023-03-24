import { PostInputModel } from '../models/posts/PostInputModel'
import { PostDBModel } from '../models/posts/PostDBModel'
import { PostsModel } from './db'
import { injectable } from 'inversify/lib/annotation/injectable';
import { LikeObjectType } from '../models/comments/CommentDBModel';
import { Document } from 'mongoose';

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

    async getPostById(postId: string) {
        return PostsModel.findOne({ id: postId })
    }

    async createLike(likeData: LikeObjectType, likedPost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>) {
        likedPost.extendedLikesInfo.likes.push(likeData)

        await likedPost.save()
        return true
    }

    async createDislike(likeData: LikeObjectType, dislikedPost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>) {
        dislikedPost.extendedLikesInfo.dislikes.push(likeData)

        await dislikedPost.save()
        return true
    }

    async setNone(editablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, likeIndex: number, dislikeIndex: number) {
        if (likeIndex > -1) {
            const noneData = { ...editablePost.extendedLikesInfo.likes[likeIndex] }
            delete editablePost.extendedLikesInfo.likes[likeIndex]
            editablePost.extendedLikesInfo.noneEntities.push(noneData)
        }

        if (dislikeIndex > -1) {
            const noneData = { ...editablePost.extendedLikesInfo.dislikes[dislikeIndex] }
            delete editablePost.extendedLikesInfo.dislikes[dislikeIndex]
            editablePost.extendedLikesInfo.noneEntities.push(noneData)
        }

        await editablePost.save()
        return true
    }

    async updateToLike(updatablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, dislikeIndex: number, noneIndex: number) {
        if (noneIndex > -1) {
            const likeData = { ...updatablePost.extendedLikesInfo.noneEntities[noneIndex] }
            delete updatablePost.extendedLikesInfo.noneEntities[noneIndex]
            updatablePost.extendedLikesInfo.likes.push(likeData)
        }

        if (dislikeIndex > -1) {
            const likeData = { ...updatablePost.extendedLikesInfo.dislikes[dislikeIndex] }
            delete updatablePost.extendedLikesInfo.dislikes[dislikeIndex]
            updatablePost.extendedLikesInfo.likes.push(likeData)
        }

        await updatablePost.save()
        return true
    }

    async updateToDislike(updatablePost: Document<unknown, {}, PostDBModel> & Omit<PostDBModel, never>, likeIndex: number, noneIndex: number) {
        if (noneIndex > -1) {
            const likeData = { ...updatablePost.extendedLikesInfo.noneEntities[noneIndex] }
            delete updatablePost.extendedLikesInfo.noneEntities[noneIndex]
            updatablePost.extendedLikesInfo.likes.push(likeData)
        }

        if (likeIndex > -1) {
            const likeData = { ...updatablePost.extendedLikesInfo.dislikes[likeIndex] }
            delete updatablePost.extendedLikesInfo.dislikes[likeIndex]
            updatablePost.extendedLikesInfo.likes.push(likeData)
        }

        await updatablePost.save()
        return true
    }
}