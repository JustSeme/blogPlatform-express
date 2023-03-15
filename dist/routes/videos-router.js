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
exports.videosRouter = void 0;
const express_1 = require("express");
const settings_1 = require("../settings");
const helpers_1 = require("../helpers");
const VideoViewModel_1 = require("../models/videos/VideoViewModel");
const videos_in_memory_repository_1 = require("../repositories/videos-in-memory-repository");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield videos_in_memory_repository_1.videosRepository.findVideos(null));
}));
exports.videosRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedVideo = yield videos_in_memory_repository_1.videosRepository.findVideos(+req.params.id);
    if (!findedVideo) {
        res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.json(findedVideo);
}));
exports.videosRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findedVideo = yield videos_in_memory_repository_1.videosRepository.findVideos(+req.params.id);
    if (!findedVideo) {
        res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    yield videos_in_memory_repository_1.videosRepository.deleteVideo(+req.params.id);
    res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.videosRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const findedVideo = yield videos_in_memory_repository_1.videosRepository.findVideos(+req.params.id);
    if (!findedVideo) {
        res.sendStatus(settings_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const errorMessagesList = [];
    if (!(0, helpers_1.isIsoDate)(req.body.publicationDate)) {
        errorMessagesList.push('publicationDate');
    }
    if (typeof req.body.canBeDownloaded !== 'boolean') {
        errorMessagesList.push('canBeDownloaded');
    }
    if (typeof req.body.minAgeRestriction !== null && typeof req.body.minAgeRestriction !== 'number' || !req.body.minAgeRestriction || req.body.minAgeRestriction > 18) {
        errorMessagesList.push('minAgeRestriction');
    }
    if (!req.body.title || req.body.title.length > 40) {
        errorMessagesList.push('title');
    }
    if (!req.body.author || req.body.author.length > 20) {
        errorMessagesList.push('author');
    }
    const resolutionsLength = (_a = req.body.availableResolutions) === null || _a === void 0 ? void 0 : _a.length;
    const filtredResolutionsLength = (_b = req.body.availableResolutions.filter(key => VideoViewModel_1.resolutionsList
        .some(val => val === key))) === null || _b === void 0 ? void 0 : _b.length;
    if (!req.body.availableResolutions || filtredResolutionsLength !== resolutionsLength) {
        errorMessagesList.push('availableResolutions');
    }
    if (errorMessagesList.length) {
        res
            .status(settings_1.HTTP_STATUSES.BAD_REQUEST_400)
            .send((0, helpers_1.generateErrorMessage)('field is incorrect', errorMessagesList));
        return;
    }
    yield videos_in_memory_repository_1.videosRepository.updateVideo(+req.params.id, req.body);
    res.sendStatus(settings_1.HTTP_STATUSES.NO_CONTENT_204);
}));
exports.videosRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const errorMessagesList = [];
    if (!req.body) {
        errorMessagesList.push('your request have\'nt body');
    }
    if (!req.body.title || req.body.title.length > 40) {
        errorMessagesList.push('title');
    }
    if (!req.body.author || req.body.author.length > 20) {
        errorMessagesList.push('author');
    }
    const resolutionsLength = (_c = req.body.availableResolutions) === null || _c === void 0 ? void 0 : _c.length;
    const filtredResolutionsLength = (_d = req.body.availableResolutions.filter(key => VideoViewModel_1.resolutionsList
        .some(val => val === key))) === null || _d === void 0 ? void 0 : _d.length;
    if (!req.body.availableResolutions || req.body.availableResolutions.length < 1 || filtredResolutionsLength !== resolutionsLength) {
        errorMessagesList.push('availableResolutions');
    }
    if (errorMessagesList.length) {
        res
            .status(settings_1.HTTP_STATUSES.BAD_REQUEST_400)
            .send((0, helpers_1.generateErrorMessage)('field is incorrect', errorMessagesList));
        return;
    }
    const createdVideo = yield videos_in_memory_repository_1.videosRepository.createVideo(req.body);
    res
        .status(settings_1.HTTP_STATUSES.CREATED_201)
        .json(createdVideo);
}));
//# sourceMappingURL=videos-router.js.map