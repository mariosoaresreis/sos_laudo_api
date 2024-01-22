"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
async function decryptData(encryptedData) {
    const encryptKey = process.env.REACT_APP_CRYPT_KEY;
    const decryptedData = crypto_js_1.default.AES.decrypt(encryptedData, encryptKey);
    return decryptedData.toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptData = decryptData;
//# sourceMappingURL=crypto.js.map