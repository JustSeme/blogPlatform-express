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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const VideoViewModel_1 = require("../../src/models/VideoViewModel");
const baseURL = '/homework01/';
describe('/videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${baseURL}testing/all-data`);
    }));
    it('should\'nt create video with incorrect title', () => __awaiter(void 0, void 0, void 0, function* () {
        const data1 = {
            title: 'Hello world and Hello JavaScript Im just want 40+ symbols in this title',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        };
        const data2 = {
            title: '',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        };
        const createResponse1 = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data1)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(createResponse1.body.errorMessages).toEqual([{
                message: 'Max length of title = 40',
                field: 'Title'
            }]);
        const createResponse2 = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(createResponse2.body.errorMessages).toEqual([{
                message: 'Field is empty',
                field: 'Title'
            }]);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos`)
            .expect(200, []);
    }));
    it('should\'nt create video with incorrect author', () => __awaiter(void 0, void 0, void 0, function* () {
        const data1 = {
            title: 'Hello world',
            author: 'justSemejustSemejustSemejustSemejustSemejustSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        };
        const data2 = {
            title: 'Hello world',
            author: '',
            availableResolutions: ['P144', 'P1080', 'P2160']
        };
        const createResponse1 = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data1)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(createResponse1.body.errorMessages).toEqual([{
                message: 'Max length of author = 20',
                field: 'Author'
            }]);
        const createResponse2 = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(createResponse2.body.errorMessages).toEqual([{
                message: 'Field is empty',
                field: 'Author'
            }]);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos`)
            .expect(200, []);
    }));
    it('should\'nt create video with incorrect availableResolutions', () => __awaiter(void 0, void 0, void 0, function* () {
        const data1 = {
            title: 'Hello world',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'maan, I was wrong']
        };
        const data2 = {
            title: 'Hello world',
            author: 'justSeme',
            availableResolutions: []
        };
        const createResponse1 = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data1)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(createResponse1.body.errorMessages).toEqual([{
                message: 'Field is incorrect',
                field: 'AvailableResolutions'
            }]);
        const createResponse2 = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data2)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(createResponse2.body.errorMessages).toEqual([{
                message: 'Field is empty',
                field: 'AvailableResolutions'
            }]);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos`)
            .expect(200, []);
    }));
    let createdVideo;
    it('should be create video with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: 'Hello world',
            author: 'justSeme',
            availableResolutions: ['P144', 'P1080', 'P2160']
        };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post(`${baseURL}videos`)
            .send(data)
            .expect(app_1.HTTP_STATUSES.CREATED_201);
        createdVideo = createResponse.body;
        const responsedResolutions = createdVideo.availableResolutions;
        responsedResolutions.filter((key) => VideoViewModel_1.resolutionsList.some(val => val === key));
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'Hello world',
            author: 'justSeme',
            canBeDownloaded: expect.any(Boolean),
            minAgeRestriction: expect.any(Boolean),
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: expect.any(Array)
        });
        expect(responsedResolutions.length > 0).toBe(true);
    }));
    it('should return the video you are looking for by id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.OK_200, createdVideo);
    }));
    it('should\'nt return the video with incorrect id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/-1000`)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('sholud\'nt update video with incorrect input availableResolutions', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['123', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: new Date().toISOString()
        };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${baseURL}videos/${createdVideo.id}`)
            .send(data)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        const recievedResponse = yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.OK_200);
        expect(recievedResponse.body).toEqual(createdVideo);
    }));
    it('sholud\'nt update video with incorrect input publicationDate', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P144', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: 123
        };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${baseURL}videos/${createdVideo.id}`)
            .send(data)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        const recievedResponse = yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.OK_200);
        expect(recievedResponse.body).toEqual(createdVideo);
    }));
    it('sholud\'nt update video with incorrect param id', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P144', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: new Date().toISOString()
        };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${baseURL}videos/-1000`)
            .send(data)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
        const recievedResponse = yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.OK_200);
        expect(recievedResponse.body).toEqual(createdVideo);
    }));
    it('sholud update video with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            title: 'Hello Samurais!',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P144', 'P240', 'P360'],
            canBeDownloaded: false,
            minAgeRestriction: 16,
            publicationDate: new Date().toISOString()
        };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${baseURL}videos/${createdVideo.id}`)
            .send(data)
            .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        const recievedResponse = yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.OK_200);
        expect(recievedResponse.body).toEqual(Object.assign(Object.assign({}, data), { id: createdVideo.id, createdAt: createdVideo.createdAt }));
    }));
    it('should delete video with correct id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/${createdVideo.id}`)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should\'nt delete video with incorrect id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${baseURL}videos/-1000`)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos/-1000}`)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should return all videos', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(`${baseURL}videos`);
    }));
});
