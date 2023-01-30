import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { UserDBModel } from '../models/users/UserDBModel'
import { usersRepository } from '../repositories/users-db-repository'

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<UserDBModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser: UserDBModel = {
            id: randomUUID(),
            login: login,
            email: email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }

        usersRepository.createUser(newUser)

        //@ts-ignore
        delete newUser._id
        return newUser
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user) return false
        
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if(user.passwordHash !== passwordHash) return false

        return true
    },

    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    }
}