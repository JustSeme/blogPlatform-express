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
const posts = [
    {
        id: '1',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '2',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '3',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '4',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
    {
        id: '5',
        title: 'The best post',
        shortDescription: 'This description should be no more 100 length',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        blogId: '1',
        blogName: 'Ржака!!! Смотреть всем!!!!!!!'
    },
];
exports.postsRepository = {
    findPosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === null) {
                return posts;
            }
            return posts.find(p => p.id === id);
        });
    },
    deletePosts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === null) {
                posts.splice(0, posts.length);
                return;
            }
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === id)
                    posts.splice(i, 1);
            }
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
                blogName: 'I do not know how to associate a blogName with real data'
            };
            posts.push(createdPost);
            return createdPost;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const findedBlogIndex = posts.findIndex(v => v.id === id);
            if (findedBlogIndex < 0) {
                return;
            }
            posts[findedBlogIndex] = {
                id: posts[findedBlogIndex].id,
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: posts[findedBlogIndex].blogName
            };
        });
    }
};
//# sourceMappingURL=posts-in-memory-repository.js.map