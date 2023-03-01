import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import { UserDBModel } from '../models/users/UserDBModel'
import { UserViewModel } from '../models/users/UsersViewModel'
import { usersRepository } from '../repositories/users-db-repository'
import { v4 as uuidv4 } from 'uuid'
import add from 'date-fns/add'
import { emailManager } from '../managers/emailManager'
import { usersQueryRepository } from '../repositories/query/users-query-repository'

export const authService = {
    async createUser(login: string, password: string, email: string, ip: string = ''): Promise<boolean> {
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
            },
            registrationData: {
                ip: ip
            }
        }

        await usersRepository.createUser(newUser)
        
        await emailManager.sendConfirmationCode(email, login, newUser.emailConfirmation.confirmationCode)

        return true
    },

    async createUserWithBasicAuth(login: string, password: string, email: string, ip: string = 'superAdmin'): Promise<UserViewModel | null> {
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
                isConfirmed: true
            },
            registrationData: {
                ip: ip
            }
        }

        await usersRepository.createUser(newUser)
        const displayedUser: UserViewModel = {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }

        return displayedUser
    },

    async confirmEmail(code: string) {
        const user = await usersQueryRepository.findUserByConfirmationCode(code)
        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        if(user.emailConfirmation.confirmationCode !== code) return false
        if(user.emailConfirmation.expirationDate < new Date()) return false
        
        return await usersRepository.updateIsConfirmed(user.id)
    },

    async resendConfirmationCode(email: string) {
        const user = await usersQueryRepository.findUserByEmail(email)
        if(!user || user.emailConfirmation.isConfirmed) return false

        const newConfirmationCode = uuidv4()
        await usersRepository.updateEmailConfirmationInfo(user.id, newConfirmationCode)

        try {
            return await emailManager.sendConfirmationCode(email, user.login, newConfirmationCode)
        } catch (error) {
            console.error(error)
            usersRepository.deleteUser(user.id)
            return false
        }
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if(!user) return false
        if(!user.emailConfirmation.isConfirmed) return false

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