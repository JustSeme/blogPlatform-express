
export type ErrorMessagesOutputModel = {
    errorsMessages: FieldError[]
}

export type FieldError = {
    message: string
    field: string
}