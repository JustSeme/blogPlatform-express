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
exports.videosRepository = void 0;
const helpers_1 = require("../helpers");
const videos = [
    {
        id: 1,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 16,
        createdAt: new Date().toISOString(),
        publicationDate: (0, helpers_1.getPublicationDate)(),
        availableResolutions: ['P1080', 'P240']
    },
    {
        id: 2,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: (0, helpers_1.getPublicationDate)(),
        availableResolutions: ['P480', 'P144', 'P720']
    },
    {
        id: 3,
        title: 'IT=Camasutra practice',
        author: 'Dimych',
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date().toISOString(),
        publicationDate: (0, helpers_1.getPublicationDate)(),
        availableResolutions: ['P720', 'P2160']
    }
];
exports.videosRepository = {
    findVideos(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id === null) {
                return videos;
            }
            return videos.find(v => v.id === id);
        });
    },
    deleteVideo(id) {
        if (id === null) {
            videos.splice(0, videos.length);
            return;
        }
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1);
            }
        }
    },
    createVideo(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdVideo = {
                id: Date.now(),
                title: body.title,
                author: body.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: (0, helpers_1.getPublicationDate)(),
                availableResolutions: body.availableResolutions
            };
            videos.push(createdVideo);
            return createdVideo;
        });
    },
    updateVideo(id, body) {
        const findedVideoIndex = videos.findIndex(v => v.id === id);
        if (findedVideoIndex < 0) {
            return;
        }
        videos[findedVideoIndex] = {
            id: videos[findedVideoIndex].id,
            createdAt: videos[findedVideoIndex].createdAt,
            title: body.title,
            author: body.author,
            availableResolutions: [...body.availableResolutions],
            canBeDownloaded: body.canBeDownloaded,
            minAgeRestriction: body.minAgeRestriction,
            publicationDate: body.publicationDate
        };
    }
};
//# sourceMappingURL=videos-repository.js.map