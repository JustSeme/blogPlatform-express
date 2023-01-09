"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helpers_1 = require("./helpers");
const VideoViewModel_1 = require("./models/VideoViewModel");
exports.app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
};
let videos = [
    {
        id: 1,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ['P1080', 'P240']
    },
    {
        id: 2,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ['P480', 'P144', 'P720']
    },
    {
        id: 3,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ['P720', 'P2160']
    }
];
exports.app.get('/homework01/videos', (req, res) => {
    res.json(videos);
});
exports.app.get('/homework01/videos/:id', (req, res) => {
    const findedVideo = videos.filter(v => v.id === +req.params.id)[0];
    if (!findedVideo) {
        res.sendStatus(404);
    }
    res.json(findedVideo);
});
exports.app.delete('/homework01/videos/:id', (req, res) => {
    const findedVideo = videos.filter(v => v.id === +req.params.id)[0];
    if (!findedVideo) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
    }
    videos = videos.filter(v => v.id !== +req.params.id);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put('/homework01/videos/:id', (req, res) => {
    const findedVideoIndex = videos.findIndex(v => v.id === +req.params.id);
    if (findedVideoIndex === -1) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const errorMessagesList = [];
    if (!(0, helpers_1.isIsoDate)(req.body.publicationDate)) {
        errorMessagesList.push('publicationDate');
    }
    if (typeof req.body.canBeDownloaded !== 'boolean') {
        errorMessagesList.push('canBeDownloaded');
    }
    if (typeof req.body.minAgeRestriction !== 'boolean' && typeof req.body.minAgeRestriction !== 'number') {
        errorMessagesList.push('minAgeRestriction');
    }
    if (!req.body.title.length || req.body.title.length > 40) {
        errorMessagesList.push('title');
    }
    if (!req.body.author.length || req.body.author.length > 20) {
        errorMessagesList.push('author');
    }
    const resolutionsLength = req.body.availableResolutions.length;
    const filtredResolutionsLength = req.body.availableResolutions.filter(key => VideoViewModel_1.resolutionsList
        .some(val => val === key)).length;
    if (!req.body.availableResolutions || filtredResolutionsLength !== resolutionsLength) {
        errorMessagesList.push('availableResolutions');
    }
    if (errorMessagesList.length) {
        res
            .status(exports.HTTP_STATUSES.BAD_REQUEST_400)
            .send((0, helpers_1.errorMessageGenerator)('field is incorrect', errorMessagesList));
        return;
    }
    videos[findedVideoIndex] = Object.assign(Object.assign({}, req.body), { id: videos[findedVideoIndex].id, createdAt: videos[findedVideoIndex].createdAt });
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.post('/homework01/videos', (req, res) => {
    const errorMessagesList = [];
    if (!req.body.title.length || req.body.title.length > 40) {
        errorMessagesList.push('title');
    }
    if (!req.body.author.length || req.body.author.length > 20) {
        errorMessagesList.push('author');
    }
    const resolutionsLength = req.body.availableResolutions.length;
    const filtredResolutionsLength = req.body.availableResolutions.filter(key => VideoViewModel_1.resolutionsList
        .some(val => val === key)).length;
    if (!req.body.availableResolutions || filtredResolutionsLength !== resolutionsLength) {
        errorMessagesList.push('availableResolutions');
    }
    if (errorMessagesList.length) {
        res
            .status(exports.HTTP_STATUSES.BAD_REQUEST_400)
            .send((0, helpers_1.errorMessageGenerator)('field is incorrect', errorMessagesList));
        return;
    }
    const createdVideo = {
        id: Date.now(),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: req.body.availableResolutions
    };
    videos.push(createdVideo);
    res
        .status(exports.HTTP_STATUSES.CREATED_201)
        .json(createdVideo);
});
exports.app.delete('/homework01/testing/all-data', (req, res) => {
    videos = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
