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
const blogs = [
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
                return blogs;
            }
            return blogs.find(b => b.id === id);
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === null) {
                blogs.splice(0, blogs.length);
                return;
            }
            for (let i = 0; i < blogs.length; i++) {
                if (blogs[i].id === id)
                    blogs.splice(i, 1);
            }
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
            blogs.push(createdBlog);
            return createdBlog;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedBlogIndex = blogs.findIndex(v => v.id === id);
            if (findedBlogIndex < 0) {
                return;
            }
            blogs[findedBlogIndex] = {
                id: blogs[findedBlogIndex].id,
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            };
        });
    }
};
//# sourceMappingURL=blogs-in-memory-repository.js.map