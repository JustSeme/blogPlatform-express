import { Router, Request, Response } from "express";
import { HTTP_STATUSES } from "../app";
import { PostViewModel } from "../models/posts/PostViewModel";
import { postsRepository } from "../repositories/posts-repository";
import { RequestWithParams } from "../types";

export const postsRouter = Router({})

postsRouter.get('/',  (req: Request, res: Response<PostViewModel[]>) => {
    const findedBlog = postsRepository.findPosts(null)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as PostViewModel[])
})

postsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response<PostViewModel>) => {
    const findedBlog = postsRepository.findPosts(req.params.id)

    if(!findedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.json(findedBlog as PostViewModel)
})