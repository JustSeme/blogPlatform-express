
export type ErrorMessagesOutputModel = {
    errorsMessages: FieldError[]
}

type FieldError = {
    message: string
    field: string
}