"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const username = "justSeme";
const password = "RMMXpX1hUlXqbKED";
exports.settings = {
    mongoURI: process.env.mongoURI || `mongodb+srv://${username}:${password}@cluster86890.fgczccf.mongodb.net/?retryWrites=true&w=majority`,
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret',
    PORT: process.env.PORT || 3000,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN || 'kepxep69@gmail.com',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || 'gpllbohdhqcrdvnh',
    test: 'test'
};
//# sourceMappingURL=settings.js.map