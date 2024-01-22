"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("App/utils/crypto");
const axios_1 = __importDefault(require("axios"));
const EmailController_1 = require("./EmailController");
class PaymentBoletoController {
    async index({}) {
        const url = process.env.SAND_BOX_BOLETO_URL;
        const token = process.env.TKN_SANDBOX;
        const options = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        const response = await axios_1.default.post(`${url}`, {
            reference_id: 'Compra de 1 Crédito(s) - Administrador',
            customer: {
                name: 'Jose da Silva',
                email: 'adm@email.com',
                tax_id: '12345678909'
            },
            charges: [
                {
                    reference_id: 'Compra de 1 Crédito(s) - Administrador',
                    description: 'Compra de 1 Crédito(s)',
                    amount: {
                        value: 11000,
                        currency: "BRL"
                    },
                    payment_method: {
                        type: "BOLETO",
                        boleto: {
                            due_date: "2023-10-20",
                            instruction_lines: {
                                line_1: "Pagamento processado para DESC Fatura",
                                line_2: "Via PagSeguro"
                            },
                            holder: {
                                name: "Jose da Silva",
                                tax_id: "22222222222",
                                email: "jose@email.com",
                                address: {
                                    country: "Brasil",
                                    region: "-",
                                    region_code: "SP",
                                    city: "-",
                                    postal_code: "00000000",
                                    street: "Produto Digital",
                                    number: "-",
                                    locality: "-"
                                }
                            }
                        }
                    }
                }
            ]
        }, options);
        return response.data;
    }
    async create({ request, auth }) {
        try {
            const body = request.only(['data']);
            let decriptData = await (0, crypto_1.decryptData)(body.data);
            decriptData = JSON.parse(decriptData);
            const userName = auth?.user?.name;
            const userEmail = auth?.user?.email;
            const url = process.env.SAND_BOX_BOLETO_URL;
            const token = process.env.TKN_SANDBOX;
            const options = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios_1.default.post(`${url}`, {
                reference_id: decriptData.reference_id + ' - ' + userName,
                customer: {
                    name: decriptData.customer.name,
                    email: userEmail,
                    tax_id: decriptData.customer.tax_id,
                },
                charges: [
                    {
                        reference_id: decriptData.reference_id + ' - ' + userName,
                        description: decriptData.reference_id,
                        amount: {
                            value: decriptData.charges.amount.value,
                            currency: "BRL"
                        },
                        payment_method: {
                            type: "BOLETO",
                            boleto: {
                                due_date: decriptData.charges.payment_method.boleto.due_date,
                                instruction_lines: {
                                    line_1: "Definir mensagem da linha 1",
                                    line_2: "Definir mensagem da linha 2",
                                },
                                holder: {
                                    name: decriptData.customer.name,
                                    tax_id: decriptData.customer.tax_id,
                                    email: userEmail,
                                    address: {
                                        country: "Brasil",
                                        region: "-",
                                        region_code: "SP",
                                        city: "-",
                                        postal_code: "00000000",
                                        street: "Produto Digital",
                                        number: "-",
                                        locality: "-"
                                    }
                                }
                            }
                        }
                    }
                ]
            }, options);
            if (response.status === 200) {
                const value = decriptData.charges.amount.value;
                const convertedValue = (value / 100).toFixed(2);
                (0, EmailController_1.sendEmailPayment)(userName, userEmail, 'BOLETO', convertedValue);
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
exports.default = PaymentBoletoController;
//# sourceMappingURL=PaymentBoletoController.js.map