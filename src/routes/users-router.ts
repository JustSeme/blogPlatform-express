import { Router, Response } from "express";
import { body } from "express-validator";
import { HTTP_STATUSES } from "../app";
import { usersService } from "../domain/users-service";
import { basicAuthorizationMiddleware } from "../middlewares/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
import { ErrorMessagesOutputModel } from "../models/ErrorMessagesOutputModel";
import { UserInputModel } from "../models/users/UserInputModel";
import { UserViewModel } from "../models/users/UsersViewModel";
import { RequestWithBody } from "../types";

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