import { attemptsModel } from "./db"

export const attemptsRepository = {
    async getAttemptsCount(clientIp: string, requestedUrl: string, lastAttemptDate: Date) {
        return attemptsModel.countDocuments({
            clientIp,
            requestedUrl,
            requestDate: {
                $gt: lastAttemptDate
            }
        })
    },

    async insertAttempt(clientIp: string, requestedUrl: string, requestDate: Date) {
        const result = await attemptsModel.create({ clientIp, requestedUrl, requestDate })
        return result ? true : false
    },

    async removeAttempts(clientIp: string, requestedUrl: string) {
        const result = await attemptsModel.deleteMany({ clientIp, requestedUrl })
        return result.deletedCount > 0
    },

    async clearAllAttempts() {
        return attemptsModel.deleteMany({})
    }
}