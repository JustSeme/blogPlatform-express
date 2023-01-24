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
exports.blogsRepository = void 0;
const db_1 = require("./db");
const __blogs = [
    {
        id: '1',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '2',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '3',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '4',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
    {
        id: '10',
        name: 'Ржака!!! Смотреть всем!!!!!!!',
        description: 'kek lol',
        websiteUrl: 'https://anyurl.com'
    },
];
exports.blogsRepository = {
    findBlogs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === null) {
                return yield db_1.client.db('blog_platform').collection('blogs').find({}).toArray();
            }
            return yield db_1.client.db('blog_platform').collection('blogs').findOne({ id: id });
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (id === null) {
                result = yield db_1.client.db('blog_platform').collection('blogs').deleteMany({});
                return result.deletedCount > 0;
            }
            result = yield db_1.client.db('blog_platform').collection('blogs').deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = {
                id: Date.now().toString(),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            };
            yield db_1.client.db('blog_platform').collection('blogs').insertOne(createdBlog);
            return createdBlog;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client.db('blog_platform').collection('blogs')
                .updateOne({ id: id }, { $set: { name: body.name, description: body.description, websiteUrl: body.websiteUrl } });
            return result.matchedCount === 1;
        });
    }
};
//# sourceMappingURL=blogs-db-repository.js.map