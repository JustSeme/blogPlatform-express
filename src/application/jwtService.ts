import jwt, { JwtPayload } from 'jsonwebtoken'
import { settings } from "../settings";
import { v4 as uuid } from 'uuid';
import { DeviceRepository } from '../repositories/device-db-repository';
import { DeviceAuthSessionsModel } from '../models/devices/DeviceSessionsModel';

export class JwtService {
    private deviceRepository: DeviceRepository

    constructor() {
        this.deviceRepository = new DeviceRepository()
    }

    async createAccessToken(expiresTime: string, userId: string) {
        return jwt.sign({ userId }, settings.JWT_SECRET, { expiresIn: expiresTime })
    }

    async createRefreshToken(expiresTime: string, deviceId: string, userId: string) {
        return jwt.sign({ deviceId, userId }, settings.JWT_SECRET, { expiresIn: expiresTime })
    }

    async getUserIdByToken(token: string) {
        try {
            const result = await jwt.verify(token, settings.JWT_SECRET) as JwtPayload
            return result.userId
        } catch (err) {
            return null
        }
    }

    async verifyRefreshToken(verifiedToken: string) {
        try {
            const result = await jwt.verify(verifiedToken, settings.JWT_SECRET) as JwtPayload

            const issuedAtForDeviceId = await this.deviceRepository.getCurrentIssuedAt(result.deviceId)
            if (issuedAtForDeviceId > result.iat!) {
                return null
            }

            return result
        } catch (err) {
            return null
        }
    }

    async verifyAccessToken(verifiedToken: string) {
        try {
            const result = await jwt.verify(verifiedToken, settings.JWT_SECRET) as JwtPayload
            return result
        } catch (err) {
            return null
        }
    }

    async refreshTokens(verifiedToken: string) {
        const result = await this.verifyRefreshToken(verifiedToken)
        if (!result) {
            return null
        }

        const newRefreshToken = await this.createRefreshToken(settings.ACCESS_TOKEN_EXPIRE_TIME, result.deviceId, result.userId)
        const newAccessToken = await this.createAccessToken(settings.REFRESH_TOKEN_EXPIRE_TIME, result.userId)
        const resultOfCreatedToken = jwt.decode(newRefreshToken) as JwtPayload

        const isUpdated = this.deviceRepository.updateSession(result.deviceId, resultOfCreatedToken.iat!, resultOfCreatedToken.exp!)

        if (!isUpdated) {
            return null
        }

        return {
            newRefreshToken,
            newAccessToken
        }
    }

    async login(userId: string, userIp: string, deviceName: string) {
        const deviceId = uuid()

        const accessToken = await this.createAccessToken(settings.ACCESS_TOKEN_EXPIRE_TIME, userId)
        const refreshToken = await this.createRefreshToken(settings.REFRESH_TOKEN_EXPIRE_TIME, deviceId, userId)
        const result = jwt.decode(refreshToken) as JwtPayload

        //Спросить, где лучше добавлять новую активную сессию (Здесь, при логине, это как-то неявно)
        const newSession = new DeviceAuthSessionsModel(result.iat!, result.exp!, userId, userIp, deviceId, deviceName)

        const isAdded = await this.deviceRepository.addSession(newSession)
        if (!isAdded) {
            return null
        }

        return {
            accessToken,
            refreshToken
        }
    }

    async logout(usedToken: string) {
        const result = await this.verifyRefreshToken(usedToken)
        if (!result) {
            return false
        }

        const isDeleted = this.deviceRepository.removeSession(result.deviceId)

        if (!isDeleted) {
            return false
        }
        return true
    }
}

export const jwtService = new JwtService()