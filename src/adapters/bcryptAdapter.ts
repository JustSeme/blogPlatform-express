import bcrypt from 'bcrypt'

export const bcryptAdapter = {
    async generatePasswordHash(password: string, rounds: number) {
        return await bcrypt.hash(password, rounds)
    },

    async comparePassword(password: string, passwordHash: string) {
        return await bcrypt.compare(password, passwordHash)
    }
}