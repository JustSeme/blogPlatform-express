"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidationMiddleware = void 0;
const app_1 = require("../app");
const blogs_query_repository_1 = require("../repositories/query/blogs-query-repository");
const blogIdValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const findedBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.blogId);
    if (!findedBlog) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    next();
});
exports.blogIdValidationMiddleware = blogIdValidationMiddleware;
//# sourceMappingURL=blogId-validation-middleware.js.map