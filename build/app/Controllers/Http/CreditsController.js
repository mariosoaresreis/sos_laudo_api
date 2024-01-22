"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const Credit_1 = __importDefault(require("App/Models/Credit"));
const date_fns_1 = require("date-fns");
class CreditsController {
    async index({ auth }) {
        const userId = auth?.user?.id;
        const credits = await Database_1.default.rawQuery(`
      SELECT id, description, to_char(plan_value, '999,999.00') as plan_value, qtd, buy_at, expired_at, status, buy_type, url_boleto, TO_CHAR(created_at AT TIME ZONE 'BRT', 'DD/MM/YYYY HH24:MI:SS') as created_at
      FROM credits
      WHERE user_id = ? 
      ORDER BY created_at DESC`, [userId]);
        return credits.rows;
    }
    async create({ request, auth }) {
        const body = request.only(['qtd', 'plan_value', 'description', 'status', 'buy_reference', 'buy_type', 'url_boleto']);
        const userId = auth?.user?.id;
        const currentDate = new Date();
        const nextYear = (0, date_fns_1.addYears)(currentDate, 1);
        const expired_at = (0, date_fns_1.format)(nextYear, 'dd/MM/yyyy');
        await Credit_1.default.create({
            user_id: userId,
            description: body.description,
            plan_value: body.plan_value,
            qtd: body.qtd,
            expired_at: expired_at,
            status: body.status,
            buy_reference: body.buy_reference,
            buy_type: body.buy_type,
            url_boleto: body.url_boleto
        });
        return { status: 200 };
    }
    async addCredits({ request }) {
        const body = request.only(['user_id', 'qtd', 'plan_value', 'description', 'status', 'buy_reference', 'buy_type', 'url_boleto']);
        const currentDate = new Date();
        const nextYear = (0, date_fns_1.addYears)(currentDate, 1);
        const expired_at = (0, date_fns_1.format)(nextYear, 'dd/MM/yyyy');
        await Credit_1.default.create({
            user_id: body.user_id,
            description: body.description,
            plan_value: body.plan_value,
            qtd: body.qtd,
            expired_at: expired_at,
            status: body.status,
            buy_reference: body.buy_reference,
            buy_type: body.buy_type,
            url_boleto: body.url_boleto
        });
        return { status: 200 };
    }
    async update({ request }) {
        const creditId = request.param('id');
        const body = request.only(['id', 'status']);
        const credit = await Credit_1.default.findOrFail(creditId);
        await credit.merge(body).save();
        return credit;
    }
    async destroy({ request }) {
        const creditId = request.param('id');
        const credit = await Credit_1.default.findOrFail(creditId);
        await credit.delete();
        return true;
    }
}
exports.default = CreditsController;
//# sourceMappingURL=CreditsController.js.map