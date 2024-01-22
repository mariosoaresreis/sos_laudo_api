"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("App/utils/crypto");
const axios_1 = __importDefault(require("axios"));
const EmailController_1 = require("./EmailController");
class PaymentCCController {
    async index({}) {
        const url = process.env.SAND_BOX_URL;
        const token = process.env.TKN_SANDBOX;
        const options = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        const response = await axios_1.default.post(`${url}`, {
            reference_id: "ex-00001",
            description: "Motivo do pagamento",
            amount: {
                value: 4000,
                currency: "BRL"
            },
            payment_method: {
                type: "CREDIT_CARD",
                installments: 1,
                capture: true,
                card: {
                    number: "372938001199778",
                    exp_month: "03",
                    exp_year: "2026",
                    security_code: "1234",
                    holder: {
                        name: "Jose da Silva"
                    }
                }
            }
        }, options);
        return {
            response: response.data
        };
    }
    async create({ request, auth }) {
        const body = request.only(['data']);
        let decriptData = await (0, crypto_1.decryptData)(body.data);
        decriptData = JSON.parse(decriptData);
        const userName = auth?.user?.name;
        const url = process.env.SAND_BOX_URL;
        const token = process.env.TKN_SANDBOX;
        const options = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        try {
            const response = await axios_1.default.post(`${url}`, {
                reference_id: decriptData.reference_id + ' - ' + userName,
                description: decriptData.description,
                amount: {
                    value: decriptData.amount.value,
                    currency: decriptData.amount.currency
                },
                payment_method: {
                    type: decriptData.payment_method.type,
                    installments: decriptData.payment_method.installments,
                    capture: decriptData.payment_method.capture,
                    card: {
                        number: decriptData.payment_method.card.number,
                        exp_month: decriptData.payment_method.card.exp_month,
                        exp_year: decriptData.payment_method.card.exp_year,
                        security_code: decriptData.payment_method.card.security_code,
                        holder: {
                            name: decriptData.payment_method.holder.name
                        }
                    }
                }
            }, options);
            if (response.status === 200 || response.status === 201) {
                const value = decriptData.amount.value;
                const convertedValue = (value / 100).toFixed(2);
                (0, EmailController_1.sendEmailPayment)(userName, auth?.user?.email, 'CARTÃO DE CRÉDITO', convertedValue);
            }
            return {
                status: 200,
                response: response.data
            };
        }
        catch (error) {
            return {
                status: 403
            };
        }
    }
}
exports.default = PaymentCCController;
//# sourceMappingURL=PaymentCCController.js.map