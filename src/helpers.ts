import { ErrorMessagesOutputModel } from './models/ErrorMessagesOutputModel'

export const errorMessageGenerator = (message: string, fields: string[]) => {
    let errorsObj: ErrorMessagesOutputModel = {
        errorMessages: []
    }
    for(let i = 0; i < fields.length; i++) {
        errorsObj.errorMessages.push({
            message: message,
            field: fields[i]
        })
    }
    return errorsObj
}

export const isIsoDate = (str: string) => {
    const dateExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)
    if(!dateExp.test(str)) return false
    const d:Date = new Date(str)
    //@ts-ignore
    return d instanceof Date && !isNaN(d) && d.toISOString() === str
}