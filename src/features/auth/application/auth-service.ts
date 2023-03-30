import { UserViewModelType } from '../api/models/UsersViewModel'
import { UsersRepository } from '../infrastructure/users-db-repository'
import { v4 as uuidv4 } from 'uuid'
import { emailManager } from '../../../managers/emailManager'
import { bcryptAdapter } from '../../../adapters/bcryptAdapter'
import { injectable } from 'inversify/lib/annotation/injectable'
import { JwtService } from '../../../application/jwtService'
import { DeviceRepository } from '../../security/infrastructure/device-db-repository'
import { DeviceAuthSessionsModel } from '../../security/domain/entities/DeviceSessionsModel'
import { settings } from '../../../settings'
import { UsersModel } from '../domain/entities/UsersEntity'

//transaction script
@injectable()
export class AuthService {
    constructor(protected usersRepository: UsersRepository, protected jwtService: JwtService, protected deviceRepository: DeviceRepository) { }

    async createUser(login: string, password: string, email: string): Promise<boolean> {
        const passwordHash = await bcryptAdapter.generatePasswordHash(password, 10)

        const newUserDTO = UsersModel.makeInstance(login, email, passwordHash, false)

        const newUser = new UsersModel(newUserDTO)

        this.usersRepository.save(newUser)

        await emailManager.sendConfirmationCode(email, login, newUserDTO.emailConfirmation.confirmationCode)

        return true
    }

    async createUserWithBasicAuth(login: string, password: string, email: string): Promise<UserViewModelType | null> {
        const passwordHash = await bcryptAdapter.generatePasswordHash(password, 10)

        const newUserDTO = UsersModel.makeInstance(login, email, passwordHash, true)

        const newUser = new UsersModel(newUserDTO)

        await this.usersRepository.save(newUser)
        const displayedUser: UserViewModelType = {
            id: newUserDTO.id,
            login: newUserDTO.login,
            email: newUserDTO.email,
            createdAt: newUserDTO.createdAt
        }

        return displayedUser
    }

    async confirmEmail(code: string) {
        const user = await this.usersRepository.findUserByConfirmationCode(code)
        if (!user) return false

        const isConfirmed = user.updateIsConfirmed(code)
        if (isConfirmed) {
            this.usersRepository.save(user)
        }
    }

    async resendConfirmationCode(email: string) {
        const user = await this.usersRepository.findUserByEmail(email)
        if (!user || user.emailConfirmation.isConfirmed) return false

        const newConfirmationCode = uuidv4()
        await this.usersRepository.updateEmailConfirmationInfo(user.id, newConfirmationCode)

        try {
            return await emailManager.sendConfirmationCode(email, user.login, newConfirmationCode)
        } catch (error) {
            console.error(error)
            this.usersRepository.deleteUser(user.id)
            return false
        }
    }

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        if (!user.emailConfirmation.isConfirmed) return false

        const isConfirmed = await bcryptAdapter.comparePassword(password, user.passwordHash)
        if (isConfirmed) {
            return user
        }
    }

    async sendPasswordRecoveryCode(email: string) {
        const user = await this.usersRepository.findUserByEmail(email)
        if (!user) {
            return true
        }
        const passwordRecoveryCode = uuidv4()

        await emailManager.sendPasswordRecoveryCode(user.email, user.login, passwordRecoveryCode)

        const isUpdated = await this.usersRepository.updatePasswordConfirmationInfo(user.id, passwordRecoveryCode)
        if (!isUpdated) {
            return false
        }
        return true
    }

    async confirmRecoveryPassword(userId: string, newPassword: string) {
        const newPasswordHash = await bcryptAdapter.generatePasswordHash(newPassword, 10)

        return this.usersRepository.updateUserPassword(userId, newPasswordHash)
    }

    async deleteUsers(userId: string) {
        return this.usersRepository.deleteUser(userId)
    }

    async login(userId: string, userIp: string, deviceName: string) {
        const deviceId = uuidv4()

        const accessToken = await this.jwtService.createAccessToken(settings.ACCESS_TOKEN_EXPIRE_TIME, userId)
        const refreshToken = await this.jwtService.createRefreshToken(settings.REFRESH_TOKEN_EXPIRE_TIME, deviceId, userId)
        const result = await this.jwtService.verifyRefreshToken(refreshToken)

        const newSession = new DeviceAuthSessionsModel(result!.iat!, result!.exp!, userId, userIp, deviceId, deviceName)

        const isAdded = await this.deviceRepository.addSession(newSession)
        if (!isAdded) {
            return null
        }

        return {
            accessToken,
            refreshToken
        }
    }

    async logout(usedToken: string) {
        const result = await this.jwtService.verifyRefreshToken(usedToken)
        if (!result) {
            return false
        }

        const isDeleted = this.deviceRepository.removeSession(result.deviceId)

        if (!isDeleted) {
            return false
        }
        return true
    }
}