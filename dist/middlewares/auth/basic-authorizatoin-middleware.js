"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthorizationMiddleware = void 0;
const settings_1 = require("../../settings");
const basicAuthorizationMiddleware = (req, res, next) => {
    const authStr = btoa('admin:qwerty');
    if (req.headers.authorization !== `Basic ${authStr}`) {
        res.sendStatus(settings_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    next();
};
exports.basicAuthorizationMiddleware = basicAuthorizationMiddleware;
//# sourceMappingURL=basic-authorizatoin-middleware.js.map