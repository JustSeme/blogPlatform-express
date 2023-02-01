import { UserDBModel } from "../models/users/UserDBModel";
import jwt from 'jsonwebtoken'
import { settings } from "../settings";

export const jwtService = {
    async createJWT(user: UserDBModel) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (err) {
            return null
        }
    }
}