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
exports.postIdValidationMiddleware = void 0;
const settings_1 = require("../../settings");
const composition_root_1 = require("../../composition-root");
const posts_service_1 = require("../../domain/posts-service");
const postsService = composition_root_1.container.resolve(posts_service_1.PostsService);
const postIdValidationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const finded = yield postsService.findPostById(req.params.postId, null);
    if (!finded) {
        res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    next();
});
exports.postIdValidationMiddleware = postIdValidationMiddleware;
//# sourceMappingURL=postId-validation-middleware.js.map