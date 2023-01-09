"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIsoDate = exports.errorMessageGenerator = void 0;
const errorMessageGenerator = (message, field) => ({
    errorMessages: [{
            message: message,
            field: field
        }]
});
exports.errorMessageGenerator = errorMessageGenerator;
const isIsoDate = (str) => {
    const dateExp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/);
    if (!dateExp.test(str))
        return false;
    const d = new Date(str);
    //@ts-ignore
    return d instanceof Date && !isNaN(d) && d.toISOString() === str;
};
exports.isIsoDate = isIsoDate;
