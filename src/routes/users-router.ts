import { Router } from "express";
import { body } from "express-validator";
import { container } from "../composition-root";
import { UsersController } from "../controllers/users-controller";
import { basicAuthorizationMiddleware } from "../middlewares/auth/basic-authorizatoin-middleware";
import { inputValidationMiddleware } from "../middlewares/validations/input-validation-middleware";
import { usersQueryRepository } from "../repositories/query/users-query-repository";

export const usersRouter = Router({})

const usersController = container.resolve<UsersController>(UsersController)

export const loginValidation = body('login')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 10 })
    .matches(/^[a-zA-Z0-9_-]*$/, 'i')
    .custom(async login => {
        return usersQueryRepository.findUserByLogin(login).then(user => {
            if (user) {
                throw new Error('Login already in use')
            }
        })
    })

export const passwordValidation = body('password')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 6, max: 20 })

export const emailValidationWithCustomSearch = body('email')
    .exists()
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .custom(async email => {
        return usersQueryRepository.findUserByEmail(email).then(user => {
            if (user) {
                throw new Error('Email already in use')
            }
        })
    })

usersRouter.post('/',
    basicAuthorizationMiddleware,
    loginValidation,
    passwordValidation,
    emailValidationWithCustomSearch,
    inputValidationMiddleware,
    usersController.createUser.bind(usersController))

usersRouter.delete('/:id',
    basicAuthorizationMiddleware,
    usersController.deleteUser.bind(usersController))

usersRouter.get('/',
    basicAuthorizationMiddleware,
    usersController.getUsers.bind(usersController))