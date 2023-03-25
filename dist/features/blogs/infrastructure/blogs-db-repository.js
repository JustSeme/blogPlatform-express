"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.BlogsRepository = void 0;
const db_1 = require("../../../repositories/db");
const injectable_1 = require("inversify/lib/annotation/injectable");
let BlogsRepository = class BlogsRepository {
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (id === null) {
                result = yield db_1.BlogsModel.deleteMany({});
                return result.deletedCount > 0;
            }
            result = yield db_1.BlogsModel.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    }
    createBlog(createdBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.BlogsModel.create(createdBlog);
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.BlogsModel.updateOne({ id: id }, { name: body.name, description: body.description, websiteUrl: body.websiteUrl });
            return result.matchedCount === 1;
        });
    }
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.BlogsModel.findOne({ id: id }, { _id: 0, __v: 0 });
        });
    }
};
BlogsRepository = __decorate([
    (0, injectable_1.injectable)()
], BlogsRepository);
exports.BlogsRepository = BlogsRepository;
//# sourceMappingURL=blogs-db-repository.js.map