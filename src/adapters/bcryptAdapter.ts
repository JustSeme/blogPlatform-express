import bcrypt from 'bcrypt'

export const bcryptAdapter = {
    async generatePasswordHash(password: string, rounds: number) {
        return bcrypt.hash(password, rounds)
    },

    async comparePassword(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash)
    }
}