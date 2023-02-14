import jwt, { JwtPayload } from 'jsonwebtoken'
import { refreshTokenBlacklist } from '../repositories/db';
import { settings } from "../settings";

export const jwtService = {
    async createJWT(userId: string, expiresTime: string) {
        return await jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: expiresTime})
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = await jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (err) {
            return null
        }
    },

    async refreshToken(verifiedToken: string) {
        const tokenInBlacklist = await refreshTokenBlacklist.find({ outDatedToken: verifiedToken }).toArray()
        if(tokenInBlacklist.length) {
            return null
        }

        try {
            const result = await jwt.verify(verifiedToken, settings.JWT_SECRET) as JwtPayload
            await refreshTokenBlacklist.insertOne({ outDatedToken: verifiedToken })
            const newRefreshToken = await this.createJWT(result.userId, '20s')
            return {
                newRefreshToken,
                userId: result.userId
            }
        } catch (err) {
            console.error(err);
            return null
        }   
    }
}