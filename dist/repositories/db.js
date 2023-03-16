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
exports.runDB = exports.AttemptsModel = exports.DeviceAuthSessionsDBModel = exports.CommentsModel = exports.UsersModel = exports.BlogsModel = exports.PostsModel = void 0;
const settings_1 = require("../settings");
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema_1 = require("./schemas/usersSchema");
const postsSchema_1 = require("./schemas/postsSchema");
const blogsSchema_1 = require("./schemas/blogsSchema");
const commentsSchema_1 = require("./schemas/commentsSchema");
const deviceAuthSessionsSchema_1 = require("./schemas/deviceAuthSessionsSchema");
const attemptsSchema_1 = require("./schemas/attemptsSchema");
let mongoURI = settings_1.settings.mongoURI;
exports.PostsModel = mongoose_1.default.model('posts', postsSchema_1.postsSchema);
exports.BlogsModel = mongoose_1.default.model('blogs', blogsSchema_1.blogsSchema);
exports.UsersModel = mongoose_1.default.model('users', usersSchema_1.usersSchema);
exports.CommentsModel = mongoose_1.default.model('comments', commentsSchema_1.commentsSchema);
exports.DeviceAuthSessionsDBModel = mongoose_1.default.model('deviceAuthSessions', deviceAuthSessionsSchema_1.deviceAuthSessionsSchema);
exports.AttemptsModel = mongoose_1.default.model('attempts', attemptsSchema_1.attemptsSchema);
function runDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoURI);
        }
        catch (err) {
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDB = runDB;
runDB();
//# sourceMappingURL=db.js.map