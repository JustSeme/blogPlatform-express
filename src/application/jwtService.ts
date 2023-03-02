import jwt, { JwtPayload } from 'jsonwebtoken'
import { settings } from "../settings";
import { v4 as uuid } from 'uuid';
import { deviceRepository } from '../repositories/device-db-repository';
import { deviceQueryRepository } from '../repositories/query/device-query-repository';

export const jwtService = {
    async createAccessToken(expiresTime: string, userId: string) {
        return jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: expiresTime})
    },

    async createRefreshToken(expiresTime: string, deviceId: string, userId: string) {
        return jwt.sign({deviceId, userId}, settings.JWT_SECRET, {expiresIn: expiresTime})
    },

    async getUserIdByToken(token: string) {
        try {
            const result = await jwt.verify(token, settings.JWT_SECRET) as JwtPayload
            return result.userId
        } catch (err) {
            return null
        }
    },

    async verifyToken(verifiedToken: string) {
        try {
            const result = await jwt.verify(verifiedToken, settings.JWT_SECRET) as JwtPayload
            const issuedAtForDeviceId = await deviceQueryRepository.getCurrentIssuedAt(result.deviceId)
            if(issuedAtForDeviceId > result.iat!) {
                return null
            }

            return result
        } catch (err) {
            return null
        }
    },

    async refreshTokens(verifiedToken: string) {
        const result = await this.verifyToken(verifiedToken)
        if(!result) {
            return null
        }
        
        const newRefreshToken = await this.createRefreshToken('20s', result.deviceId, result.userId)
        const newAccessToken = await this.createAccessToken('10s', result.userId)
        const resultOfCreatedToken = jwt.decode(newRefreshToken) as JwtPayload

        const isUpdated = deviceRepository.updateSession(result.deviceId, resultOfCreatedToken.iat!, resultOfCreatedToken.exp!)
        
        if(!isUpdated) {
            return null
        }

        return {
            newRefreshToken,
            newAccessToken
        }
    },

    async login(userId: string, userIp: string, deviceName: string) {
        const deviceId = uuid()

        const accessToken = await this.createAccessToken('10s', userId)
        const refreshToken = await this.createRefreshToken('20s', deviceId, userId)
        const result = jwt.decode(refreshToken) as JwtPayload
        
        const isAdded = await deviceRepository.addSession(result.iat!, result.exp!, userId, userIp, deviceId, deviceName)
        if(!isAdded) {
            return null
        }

        return {
            accessToken,
            refreshToken
        }
    },

    async logout(usedToken: string) {
        const result = await this.verifyToken(usedToken)
        if(!result) {
            return false
        }

        const isDeleted = deviceRepository.removeSession(result.deviceId)

        if(!isDeleted) {
            return false
        }
        return true
    }
}