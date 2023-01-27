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
exports.postsQueryRepository = void 0;
const db_1 = require("./db");
exports.postsQueryRepository = {
    findPosts(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection, sortBy, pageNumber, pageSize } = queryParams;
            let postsCursor = yield db_1.postsCollection.find({}, { projection: { _id: 0 } });
            const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1;
            const resultedPosts = yield postsCursor.sort({ [sortBy]: sortDirectionNumber }).toArray();
            return {
                pagesCount: 20,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: 100,
                items: resultedPosts
            };
        });
    },
    findPostsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
        });
    }
};
//# sourceMappingURL=posts-query-repository.js.map