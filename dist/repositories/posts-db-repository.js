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
exports.postsRepository = {
    findPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === null) {
                return yield db_1.postsCollection.find({}, { projection: { _id: 0 } }).toArray();
            }
            return yield db_1.postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (id === null) {
                result = yield db_1.postsCollection.deleteMany({});
                return result.deletedCount > 0;
            }
            result = yield db_1.postsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = {
                id: Date.now().toString(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: 'I do not know how to associate a blogName with real data',
                createdAt: new Date().toISOString(),
            };
            yield db_1.postsCollection.insertOne(createdPost);
            //@ts-ignore
            delete createdPost._id;
            return createdPost;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ id: id }, { $set: { content: body.content, title: body.title, shortDescription: body.shortDescription, blogId: body.blogId } });
            return result.matchedCount === 1;
        });
    }
};
//# sourceMappingURL=posts-db-repository.js.map