import { JwtService } from "../application/jwtService";
import { usersQueryRepository } from "../repositories/query/users-query-repository";
import { ReadCommentsQueryParams } from "../models/comments/ReadCommentsQuery";
import { CommentsWithQueryOutputModel } from "../models/comments/CommentViewModel";
import { CommentInputModel } from "../models/comments/CommentInputModel";
import { CommentViewModel } from "../models/comments/CommentViewModel";
import { CommentsService } from "../domain/comments-service";
import { HTTP_STATUSES } from "../settings";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { PostInputModel } from "../models/posts/PostInputModel";
import { PostsWithQueryOutputModel, PostDBModel } from "../models/posts/PostDBModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery } from "../types/types";
import { PostsService } from "../domain/posts-service";
import { postsQueryRepository } from "../repositories/query/posts-query-repository";
import { ReadPostsQueryParams } from "../models/posts/ReadPostsQuery";
import { Response } from "express";
import { injectable } from 'inversify/lib/annotation/injectable';

@injectable()
export class PostsController {
    constructor(protected jwtService: JwtService, protected postsService: PostsService, protected commentsService: CommentsService) { }

    async getPosts(req: RequestWithQuery<ReadPostsQueryParams>, res: Response<PostsWithQueryOutputModel>) {
        const findedPosts = await postsQueryRepository.findPosts(req.query, null)

        if (!findedPosts.items.length) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(findedPosts as PostsWithQueryOutputModel)
    }

    async getPostById(req: RequestWithParams<{ id: string }>, res: Response<PostDBModel>) {
        const findedPosts = await postsQueryRepository.findPostById(req.params.id)

        if (!findedPosts) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(findedPosts as PostDBModel)
    }

    async getCommentsForPost(req: RequestWithParamsAndQuery<{ postId: string }, ReadCommentsQueryParams>, res: Response<CommentsWithQueryOutputModel>) {
        const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null

        const findedComments = await this.commentsService.getComments(req.query, req.params.postId, accessToken)
        res.send(findedComments)
    }

    async createPost(req: RequestWithBody<PostInputModel>, res: Response<PostDBModel | ErrorMessagesOutputModel>) {
        const createdPost = await this.postsService.createPost(req.body, null)

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdPost)
    }

    async createCommentForPost(req: RequestWithParamsAndBody<{ postId: string }, CommentInputModel>, res: Response<CommentViewModel | ErrorMessagesOutputModel>) {
        const token = req.headers.authorization!.split(' ')[1]
        const userId = await this.jwtService.getUserIdByToken(token)
        const commentator = await usersQueryRepository.findUserById(userId)

        const createdComment = await this.commentsService.createComment(req.body.content, commentator, req.params.postId)
        if (!createdComment) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res
            .status(HTTP_STATUSES.CREATED_201)
            .send(createdComment)
    }

    async updatePost(req: RequestWithParamsAndBody<{ id: string }, PostInputModel>, res: Response<PostDBModel | ErrorMessagesOutputModel>) {
        const isUpdated = await this.postsService.updatePost(req.params.id, req.body)
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }

    async deletePost(req: RequestWithParams<{ id: string }>, res: Response<ErrorMessagesOutputModel>) {
        const isDeleted = await this.postsService.deletePosts(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return
        }

        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
}