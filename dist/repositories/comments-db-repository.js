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
exports.CommentsRepository = void 0;
const db_1 = require("./db");
class CommentsRepository {
    createComment(createdComment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.CommentsModel.create(createdComment);
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.CommentsModel.deleteOne({ id: commentId });
            return result.deletedCount === 1;
        });
    }
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.CommentsModel.updateOne({ id: commentId }, { content: content });
            return result.matchedCount === 1;
        });
    }
}
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments-db-repository.js.map