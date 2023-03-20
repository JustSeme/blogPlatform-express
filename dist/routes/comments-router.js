"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentContentValidation = exports.commentsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../composition-root");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const commentId_validation_middleware_1 = require("../middlewares/validations/commentId-validation-middleware");
const input_validation_middleware_1 = require("../middlewares/validations/input-validation-middleware");
const ownership_validation_middleware_1 = require("../middlewares/validations/ownership-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentContentValidation = (0, express_validator_1.body)('content')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 20, max: 300 });
const likeValidation = (0, express_validator_1.body)('likeStatus')
    .exists()
    .trim()
    .custom(value => {
    if (value === 'None' || value === 'Like' || value === 'Dislike') {
        return true;
    }
    throw new Error('likeStatus is incorrect');
});
exports.commentsRouter.get('/:commentId', composition_root_1.commentsController.getComment.bind(composition_root_1.commentsController));
exports.commentsRouter.delete('/:commentId', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, ownership_validation_middleware_1.ownershipValidationMiddleware, composition_root_1.commentsController.deleteComment.bind(composition_root_1.commentsController));
exports.commentsRouter.put('/:commentId', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, ownership_validation_middleware_1.ownershipValidationMiddleware, exports.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.commentsController.updateComment.bind(composition_root_1.commentsController));
exports.commentsRouter.put('/:commentId/like-status', auth_middleware_1.authMiddleware, commentId_validation_middleware_1.commentIdValidationMiddleware, likeValidation, input_validation_middleware_1.inputValidationMiddleware, composition_root_1.commentsController.updateLikeForComment.bind(composition_root_1.commentsController));
//# sourceMappingURL=comments-router.js.map