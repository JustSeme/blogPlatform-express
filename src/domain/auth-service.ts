import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { UserDBModel } from '../models/users/UserDBModel'
import { UserViewModel } from '../models/users/UsersViewModel'
import { usersRepository } from '../repositories/users-db-repository'
import { v4 as uuidv4 } from 'uuid'
import add from 'date-fns/add'
import { emailManager } from '../managers/emailManager'

export const authService = {
    async createUser(login: string, password: string, email: string): Promise<UserViewModel | null> {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser: UserDBModel = {
            id: randomUUID(),
            login: login,
            email: email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        }

        await usersRepository.createUser(newUser)
        const displayedUser: UserViewModel = {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
        try {
            emailManager.sendConfirmationCode(email, login, newUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            usersRepository.deleteUser(newUser.id)
            return null
        }
        return displayedUser
    },

    async confirmEmail(code: string) {
        const user = await usersRepository.findUserByConfirmationCode(code)
        if(!user) {
            return false
        }

        if(user.emailConfirmation.expirationDate > new Date() && user.emailConfirmation.confirmationCode === code) {
            return await usersRepository.updateConfirmation(user.id)
        }

        return false
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user) return false

        const isConfirmed = await bcrypt.compare(password, user.passwordHash)
        if(isConfirmed) {
            return user
        }
    },

    async deleteUsers(userId: string | null) {
        if(userId) {
            return await usersRepository.deleteUser(userId)
        }
        return await usersRepository.deleteUsers()
    }
}