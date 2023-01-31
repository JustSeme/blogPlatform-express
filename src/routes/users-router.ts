import { Router, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { usersService } from "../domain/users-service";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { ReadUsersQuery } from "../models/users/ReadUsersQuery";
import { UserInputModel } from "../models/users/UserInputModel";
import { UsersWithQueryOutputModel, UserViewModel } from "../models/users/UsersViewModel";
import { usersQueryRepository } from "../repositories/query/users-query-repository";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../types";

export const usersRouter = Router({})

const loginValidation = body('login')
.exists()
.trim()
.notEmpty()
.isString()
.isLength({ min: 3, max: 10 })
.matches(/^[a-zA-Z0-9_-]*$/, 'i')

const passwordValidation = body('password')
.exists()
.trim()
.notEmpty()
.isString()
.isLength({ min: 6, max: 20 })

const emailValidation = body('email')
.exists()
.trim()
.notEmpty()
.isString()
.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

usersRouter.post('/', 
    basicAuthorizationMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<UserInputModel>, res: Response<UserViewModel | ErrorMessagesOutputModel>) => {
        const createdUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
    
        res.status(HTTP_STATUSES.CREATED_201).json(createdUser)
})

usersRouter.delete('/:id',
    basicAuthorizationMiddleware,
    async (req: RequestWithParams<{id: string}>, res: Response) => {
        const isDeleted = await usersService.deleteUsers(req.params.id)
        if(!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

usersRouter.get('/',
    basicAuthorizationMiddleware,
    async (req: RequestWithQuery<ReadUsersQuery>, res: Response<UsersWithQueryOutputModel>) => {
        const findedUsers = await usersQueryRepository.findUsers(req.query)

        res.json(findedUsers)
    })