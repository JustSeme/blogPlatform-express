"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const app_1 = require("../../app");
const helpers_1 = require("../../helpers");
const VideoViewModel_1 = require("../../models/VideoViewModel");
const videos_repository_1 = require("../../repositories/videos-repository");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get('/', (req, res) => {
    res.json(videos_repository_1.videosRepository.findVideos(null));
});
exports.videosRouter.get('/:id', (req, res) => {
    const findedVideo = videos_repository_1.videosRepository.findVideos(+req.params.id);
    if (!findedVideo) {
        res.sendStatus(404);
    }
    res.json(findedVideo);
});
exports.videosRouter.delete('/:id', (req, res) => {
    const findedVideo = videos_repository_1.videosRepository.findVideos(+req.params.id);
    if (!findedVideo) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    videos_repository_1.videosRepository.deleteVideo(+req.params.id);
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.videosRouter.put('/:id', (req, res) => {
    var _a, _b;
    const findedVideo = videos_repository_1.videosRepository.findVideos(+req.params.id);
    if (!findedVideo) {
        res.sendStatus(app_1.HTTP_STATUSES.NOT_FOUND_404);
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
            .status(app_1.HTTP_STATUSES.BAD_REQUEST_400)
            .send((0, helpers_1.generateErrorMessage)('field is incorrect', errorMessagesList));
        return;
    }
    videos_repository_1.videosRepository.updateVideo(+req.params.id, req.body);
    res.sendStatus(app_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.videosRouter.post('/', (req, res) => {
    var _a, _b;
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
    const resolutionsLength = (_a = req.body.availableResolutions) === null || _a === void 0 ? void 0 : _a.length;
    const filtredResolutionsLength = (_b = req.body.availableResolutions.filter(key => VideoViewModel_1.resolutionsList
        .some(val => val === key))) === null || _b === void 0 ? void 0 : _b.length;
    if (!req.body.availableResolutions || req.body.availableResolutions.length < 1 || filtredResolutionsLength !== resolutionsLength) {
        errorMessagesList.push('availableResolutions');
    }
    if (errorMessagesList.length) {
        res
            .status(app_1.HTTP_STATUSES.BAD_REQUEST_400)
            .send((0, helpers_1.generateErrorMessage)('field is incorrect', errorMessagesList));
        return;
    }
    const createdVideo = videos_repository_1.videosRepository.createVideo(req.body);
    res
        .status(app_1.HTTP_STATUSES.CREATED_201)
        .json(createdVideo);
});
//# sourceMappingURL=videos-router.js.map