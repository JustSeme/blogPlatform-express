import { Response } from "express"
import { injectable } from "inversify/lib/annotation/injectable"
import { AuthService } from "../domain/auth-service"
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel"
import { ReadUsersQuery } from "../models/users/ReadUsersQuery"
import { UserInputModel } from "../models/users/UserInputModel"
import { UsersWithQueryOutputModel, UserViewModelType } from "../models/users/UsersViewModel"
import { usersQueryRepository } from "../repositories/query/users-query-repository"
import { HTTP_STATUSES } from "../settings"
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types/types"

@injectable()
export class UsersController {
    constructor(protected authService: AuthService) { }

    async createUser(req: RequestWithBody<UserInputModel>, res: Response<UserViewModelType | ErrorMessagesOutputModel>) {
        const createdUser = await this.authService.createUserWithBasicAuth(req.body.login, req.body.password, req.body.email)
        if (!createdUser) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        res.status(HTTP_STATUSES.CREATED_201).send(createdUser!)
    }

    async getUsers(req: RequestWithQuery<ReadUsersQuery>, res: Response<UsersWithQueryOutputModel>) {
        const findedUsers = await usersQueryRepository.findUsers(req.query)

        res.send(findedUsers)
    }

    async deleteUser(req: RequestWithParams<{ id: string }>, res: Response) {
        const isDeleted = await this.authService.deleteUsers(req.params.id)
        if (!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
}