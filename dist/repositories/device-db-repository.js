"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.DeviceRepository = void 0;
const db_1 = require("./db");
const injectable_1 = require("inversify/lib/annotation/injectable");
let DeviceRepository = class DeviceRepository {
    addSession(newSession) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.DeviceAuthSessionsDBModel.create(newSession);
            return result ? true : false;
        });
    }
    removeSession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.DeviceAuthSessionsDBModel.deleteOne({ 'deviceInfo.deviceId': deviceId });
            return result.deletedCount === 1;
        });
    }
    deleteAllSessions(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.DeviceAuthSessionsDBModel.deleteMany({ $and: [{ 'userInfo.userId': userId }, { 'deviceInfo.deviceId': { $ne: deviceId } }] });
            return result.deletedCount > 0;
        });
    }
    updateSession(deviceId, issuedAt, expireDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.DeviceAuthSessionsDBModel.updateOne({ "deviceInfo.deviceId": deviceId }, { issuedAt, expireDate });
            return result.matchedCount === 1;
        });
    }
    getDevicesForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.DeviceAuthSessionsDBModel.find({ "userInfo.userId": userId });
        });
    }
    getCurrentIssuedAt(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.DeviceAuthSessionsDBModel.findOne({ 'deviceInfo.deviceId': deviceId });
            return result.issuedAt;
        });
    }
};
DeviceRepository = __decorate([
    (0, injectable_1.injectable)()
], DeviceRepository);
exports.DeviceRepository = DeviceRepository;
//# sourceMappingURL=device-db-repository.js.map