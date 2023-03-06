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
exports.runDB = exports.attemptsCollection = exports.deviceAuthSessions = exports.commentsCollection = exports.usersCollection = exports.blogsCollection = exports.postsCollection = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
let mongoURI = settings_1.settings.mongoURI;
const client = new mongodb_1.MongoClient(mongoURI);
const blogPlatformDB = client.db('blog_platform');
exports.postsCollection = blogPlatformDB.collection('posts');
exports.blogsCollection = blogPlatformDB.collection('blogs');
exports.usersCollection = blogPlatformDB.collection('users');
exports.commentsCollection = blogPlatformDB.collection('comments');
exports.deviceAuthSessions = blogPlatformDB.collection('deviceAuthSessions');
exports.attemptsCollection = blogPlatformDB.collection('attempts');
function runDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("blog_platform").command({ ping: 1 });
        }
        catch (err) {
            yield client.close();
            console.log(err);
        }
    });
}
exports.runDB = runDB;
runDB();
//# sourceMappingURL=db.js.map