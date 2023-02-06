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
exports.blogsService = void 0;
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
exports.blogsService = {
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_db_repository_1.blogsRepository.deleteBlog(id);
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = {
                id: Date.now().toString(),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: true
            };
            yield blogs_db_repository_1.blogsRepository.createBlog(createdBlog);
            //@ts-ignore
            delete createdBlog._id;
            return createdBlog;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.updateBlog(id, body);
        });
    }
};
//# sourceMappingURL=blogs-service.js.map