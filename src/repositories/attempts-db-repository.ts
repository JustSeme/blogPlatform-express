import { attemptsCollection } from "./db"

export const attemptsRepository = {
    async getAttemptsCount(clientIp: string, requestedUrl: string, lastAttemptDate: Date) {
        return await attemptsCollection.countDocuments({
            clientIp, 
            requestedUrl,
            requestDate: {
                $gt: lastAttemptDate
            }
        })
    },

    async insertAttempt(clientIp: string, requestedUrl: string, requestDate: Date) {
        const result = await attemptsCollection.insertOne({clientIp, requestedUrl, requestDate})
        return result.acknowledged
    },
    
    async removeAttempts(clientIp: string, requestedUrl: string) {
        const result = await attemptsCollection.deleteMany({clientIp, requestedUrl})
        return result.acknowledged
    },

    async clearAllAttempts() {
        return await attemptsCollection.deleteMany({})
    }
}