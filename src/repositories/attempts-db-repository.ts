import { attemptsCollection } from "./db"

export const attemptsRepository = {
    async getAttemptsCountPerTime(clientIp: string, requestedUrl: string, lastAttemptDate: Date) {
        return attemptsCollection.countDocuments({
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
    }
}