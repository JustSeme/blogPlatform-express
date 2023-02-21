import { add } from 'date-fns';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { settings } from "../settings";
import { v4 as uuid } from 'uuid';
import { deviceAuthSessions } from '../repositories/db';
import { deviceRepository } from '../repositories/device-db-repository';

export const jwtService = {
    async createJWT(expiresTime: string, ...payload: Array<string | Date>) {
        return await jwt.sign({...payload}, settings.JWT_SECRET, {expiresIn: expiresTime})
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (err) {
            return null
        }
    },

    async verifyToken(verifiedToken: string) {
        /* const tokenInBlacklist = await refreshTokenBlacklist.find({ outDatedToken: verifiedToken }).toArray()
        if(tokenInBlacklist.length) {
            return null
        } */
        
        try {
            const result = await jwt.verify(verifiedToken, settings.JWT_SECRET) as JwtPayload
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
        
        /* await refreshTokenBlacklist.insertOne({ outDatedToken: verifiedToken }) */
        
        const newRefreshToken = await this.createJWT('20s', result.userId)
        const newAccessToken = await this.createJWT('10s', result.userId)
        return {
            newRefreshToken,
            newAccessToken
        }
    },

    async login(userId: string, userIp: string, deviceName: string) {
        const deviceId = uuid()

        const accessToken = await this.createJWT('10min', userId)
        const refreshToken = await this.createJWT('20min', userId, deviceId)
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

        const isDeleted = deviceRepository.destroySesion(result.deviceId)

        if(!isDeleted) {
            return false
        }
        return true
    }
}