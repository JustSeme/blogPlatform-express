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
exports.commentsQueryRepository = void 0;
const db_1 = require("../db");
exports.commentsQueryRepository = {
    findComments(queryParams, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = 'desc', sortBy = 'createdAt', pageNumber = 1, pageSize = 10 } = queryParams;
            const filter = {
                postId: postId
            };
            const totalCount = yield db_1.commentsCollection.count(filter);
            const pagesCount = Math.ceil(totalCount / +pageSize);
            const skipCount = (+pageNumber - 1) * +pageSize;
            let commentsCursor = yield db_1.commentsCollection.find(filter, { projection: { _id: 0 } }).skip(skipCount).limit(+pageSize);
            const sortDirectionNumber = sortDirection === 'asc' ? 1 : -1;
            const resultedComments = yield commentsCursor.sort({ [sortBy]: sortDirectionNumber }).toArray();
            return {
                pagesCount: pagesCount,
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: totalCount,
                items: resultedComments
            };
        });
    },
};
//# sourceMappingURL=comments-query-repository.js.map