import { Router } from "express";
import { body } from "express-validator";
import { container } from "../../../../composition-root";
import { CommentsController } from "../controllers/comments-controller";
import { authMiddleware } from "../../../../middlewares/auth/auth-middleware";
import { commentIdValidationMiddleware } from "../../../../middlewares/validations/commentId-validation-middleware";
import { inputValidationMiddleware } from "../../../../middlewares/validations/input-validation-middleware";
import { ownershipValidationMiddleware } from "../../../../middlewares/validations/ownership-validation-middleware";

export const commentsRouter = Router({})

const commentsController = container.resolve<CommentsController>(CommentsController)

export const commentContentValidation = body('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 20, max: 300 })


export const likeValidation = body('likeStatus')
    .exists()
    .trim()
    .custom(value => {
        if (value === 'None' || value === 'Like' || value === 'Dislike') {
            return true
        }
        throw new Error('likeStatus is incorrect')
    })

commentsRouter.get('/:commentId',
    commentsController.getComment.bind(commentsController))

commentsRouter.delete('/:commentId',
    authMiddleware,
    commentIdValidationMiddleware,
    ownershipValidationMiddleware,
    commentsController.deleteComment.bind(commentsController))

commentsRouter.put('/:commentId',
    authMiddleware,
    commentIdValidationMiddleware,
    ownershipValidationMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRouter.put('/:commentId/like-status',
    authMiddleware,
    commentIdValidationMiddleware,
    likeValidation,
    inputValidationMiddleware,
    commentsController.updateLikeStatus.bind(commentsController)
)