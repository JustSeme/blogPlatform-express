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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = exports.attemptsModel = exports.deviceAuthSessionsModel = exports.commentsModel = exports.usersModel = exports.blogsModel = exports.postsModel = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema_1 = require("./schemas/usersSchema");
const postsSchema_1 = require("./schemas/postsSchema");
const blogsSchema_1 = require("./schemas/blogsSchema");
const commentsSchema_1 = require("./schemas/commentsSchema");
const deviceAuthSessionsSchema_1 = require("./schemas/deviceAuthSessionsSchema");
const attemptsSchema_1 = require("./schemas/attemptsSchema");
let mongoURI = settings_1.settings.mongoURI;
const client = new mongodb_1.MongoClient(mongoURI);
const blogPlatformDB = client.db('blog_platform');
exports.postsModel = mongoose_1.default.model('posts', postsSchema_1.postsSchema);
exports.blogsModel = mongoose_1.default.model('blogs', blogsSchema_1.blogsSchema);
exports.usersModel = mongoose_1.default.model('users', usersSchema_1.usersSchema);
exports.commentsModel = mongoose_1.default.model('comments', commentsSchema_1.commentsSchema);
exports.deviceAuthSessionsModel = mongoose_1.default.model('deviceAuthSessions', deviceAuthSessionsSchema_1.deviceAuthSessionsSchema);
exports.attemptsModel = mongoose_1.default.model('attempts', attemptsSchema_1.attemptsSchema);
function runDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoURI);
            yield client.connect();
            yield client.db("blog_platform").command({ ping: 1 });
        }
        catch (err) {
            yield mongoose_1.default.disconnect();
            yield client.close();
            console.log(`can't connect to db`);
        }
    });
}
exports.runDB = runDB;
runDB();
//# sourceMappingURL=db.js.map