import { UserDBModel } from '../models/users/UserDBModel'
import { UserViewModelType } from '../models/users/UsersViewModel'
import { usersRepository } from '../repositories/users-db-repository'
import { v4 as uuidv4 } from 'uuid'
import add from 'date-fns/add'
import { emailManager } from '../managers/emailManager'
import { usersQueryRepository } from '../repositories/query/users-query-repository'
import { bcryptAdapter } from '../adapters/bcryptAdapter'

const getUserDto = (login: string, email: string, isConfirmed: boolean, passwordHash: string) => {
    const newUser: UserDBModel = {
        id: uuidv4(),
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
            isConfirmed: isConfirmed
        },
        passwordRecovery: {
            confirmationCode: null,
            expirationDate: new Date()
        }
    }

    return newUser
}

export const authService = {
    async createUser(login: string, password: string, email: string): Promise<boolean> {
        const passwordHash = await bcryptAdapter.generatePasswordHash(password, 10)

        const newUser = getUserDto(login, email, false, passwordHash)

        usersRepository.createUser(newUser)

        emailManager.sendConfirmationCode(email, login, newUser.emailConfirmation.confirmationCode)

        return true
    },

    async createUserWithBasicAuth(login: string, password: string, email: string): Promise<UserViewModelType | null> {
        const passwordHash = await bcryptAdapter.generatePasswordHash(password, 10)

        const newUser = await getUserDto(login, email, true, passwordHash)

        await usersRepository.createUser(newUser)
        const displayedUser: UserViewModelType = {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }

        return displayedUser
    },

    async confirmEmail(code: string) {
        const user = await usersQueryRepository.findUserByConfirmationCode(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        return await usersRepository.updateIsConfirmed(user.id)
    },

    async resendConfirmationCode(email: string) {
        const user = await usersQueryRepository.findUserByEmail(email)
        if (!user || user.emailConfirmation.isConfirmed) return false

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
        if (!user) return false
        if (!user.emailConfirmation.isConfirmed) return false

        const isConfirmed = await bcryptAdapter.comparePassword(password, user.passwordHash)
        if (isConfirmed) {
            return user
        }
    },

    async sendPasswordRecoveryCode(email: string) {
        const user = await usersQueryRepository.findUserByEmail(email)
        if (!user) {
            return true
        }
        const passwordRecoveryCode = uuidv4()

        emailManager.sendPasswordRecoveryCode(user.email, user.login, passwordRecoveryCode)

        const isUpdated = await usersRepository.updatePasswordConfirmationInfo(user.id, passwordRecoveryCode)
        if (!isUpdated) {
            return false
        }
        return true
    },

    async confirmRecoveryPassword(userId: string, newPassword: string) {
        const newPasswordHash = await bcryptAdapter.generatePasswordHash(newPassword, 10)

        return usersRepository.updateUserPassword(userId, newPasswordHash)
    },

    async deleteUsers(userId: string | null) {
        if (userId) {
            return await usersRepository.deleteUser(userId)
        }
        return await usersRepository.deleteUsers()
    }
}