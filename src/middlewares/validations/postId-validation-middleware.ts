import { NextFunction, Response } from "express"
import { HTTP_STATUSES } from "../../settings"
import { container } from "../../composition-root"
import { PostsService } from "../../features/blogs/application/posts-service"

const postsService = container.resolve(PostsService)

export const postIdValidationMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const finded = await postsService.findPostById(req.params.postId, null)

    if (!finded) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    next()
}