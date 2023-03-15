"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const db_1 = require("./repositories/db");
const settings_1 = require("./settings");
const port = settings_1.settings.PORT;
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDB)();
    exports.server = settings_1.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
//# sourceMappingURL=app.js.map