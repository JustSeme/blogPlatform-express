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
exports.postsRepository = void 0;
const db_1 = require("./db");
class PostsRepository {
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.PostsModel.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
    createPost(createdPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.PostsModel.create(createdPost);
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.PostsModel.updateOne({ id: id }, { $set: { content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId } });
            return result.matchedCount === 1;
        });
    }
}
exports.postsRepository = new PostsRepository();
//# sourceMappingURL=posts-db-repository.js.map