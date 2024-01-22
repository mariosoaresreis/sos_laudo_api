"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("App/utils/crypto");
const axios_1 = __importDefault(require("axios"));
const EmailController_1 = require("./EmailController");
class PaymentPixController {
    async index({}) {
        try {
            const url = process.env.SAND_BOX_QR_URL;
            const token = process.env.TKN_SANDBOX;
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await axios_1.default.post(`${url}`, {
                reference_id: "ex-00001",
                customer: {
                    name: "Jose da Silva",
                    email: "email@test.com",
                    tax_id: "12345678909",
                },
                items: [
                    {
                        reference_id: "referencia do item",
                        name: "nome do item",
                        quantity: 1,
                        unit_amount: 500
                    }
                ],
                qr_codes: [
                    {
                        amount: {
                            value: 500
                        },
                    }
                ],
            }, options);
            return {
                status: 200,
                response: response.data.qr_codes[0].links
            };
        }
        catch (error) {
            return {
                status: 400,
                error: error
            };
        }
    }
    async create({ request, auth }) {
        try {
            const body = request.only(['data']);
            let decriptData = await (0, crypto_1.decryptData)(body.data);
            decriptData = JSON.parse(decriptData);
            const userName = auth?.user?.name;
            const userEmail = auth?.user?.email;
            const url = process.env.SAND_BOX_QR_URL;
            const token = process.env.TKN_SANDBOX;
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await axios_1.default.post(`${url}`, {
                reference_id: decriptData.reference_id + ' - ' + userName,
                customer: {
                    name: userName,
                    email: userEmail,
                    tax_id: decriptData.customer.tax_id,
                },
                items: [
                    {
                        reference_id: decriptData.items.reference_id,
                        name: decriptData.items.name,
                        quantity: decriptData.items.quantity,
                        unit_amount: decriptData.items.unit_amount
                    }
                ],
                qr_codes: [
                    {
                        amount: {
                            value: decriptData.qr_codes.amount.value
                        },
                    }
                ],
            }, options);
            if (response.status === 200 || response.status === 201) {
                const value = decriptData.qr_codes.amount.value;
                const convertedValue = (value / 100).toFixed(2);
                (0, EmailController_1.sendEmailPayment)(userName, userEmail, 'PIX', convertedValue);
            }
            return {
                status: 200,
                response: response.data
            };
        }
        catch (error) {
            return {
                status: 403,
                error: error
            };
        }
    }
}
exports.default = PaymentPixController;
//# sourceMappingURL=PaymentPixController.js.map