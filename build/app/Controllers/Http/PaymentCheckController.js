"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const axios_1 = __importDefault(require("axios"));
class PaymentCheckController {
    async index({ auth }) {
        const userId = auth.user?.id;
        const pendingPayment = await Database_1.default.rawQuery(`SELECT id, buy_reference FROM credits WHERE user_id = ? AND status = 'A' AND buy_type = 'B'`, [userId]);
        if (pendingPayment.rows) {
            for (const i of pendingPayment.rows) {
                const id = i.id;
                const itemPayment = i.buy_reference;
                const url = process.env.SAND_BOX_VALIDATE_PAYMENT;
                const token = process.env.TKN_SANDBOX;
                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                };
                const response = await axios_1.default.get(`${url}` + `${itemPayment}`, options);
                if (response.data.status === 'PAID') {
                    const queryUpdate = await Database_1.default.rawQuery(`UPDATE credits set status = 'C' WHERE id = ${id}`);
                }
                else if (response.data.status === 'CANCELED') {
                    const queryUpdate = await Database_1.default.rawQuery(`UPDATE credits set status = 'X' WHERE id = ${id}`);
                }
                else {
                    console.log('WAIT');
                }
            }
            return { status: 200 };
        }
    }
}
exports.default = PaymentCheckController;
//# sourceMappingURL=PaymentCheckController.js.map