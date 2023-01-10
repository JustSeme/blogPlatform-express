import { ErrorMessagesOutputModel } from './models/ErrorMessagesOutputModel'

export const generateErrorMessage = (message: string, fields: string[]) => {
    let errorsObj: ErrorMessagesOutputModel = {
        errorsMessages: []
    }
    for(let i = 0; i < fields.length; i++) {
        errorsObj.errorsMessages.push({
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

export const getPublicationDate = () => {
    const today = new Date().getDate()
    const todayIncrement = new Date().setDate(today + 1)
    return new Date(todayIncrement).toISOString()
}