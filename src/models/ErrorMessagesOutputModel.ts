
export type ErrorMessagesOutputModel = {
    errorMessages: FieldError[]
}

type FieldError = {
    message: string
    field: string
}