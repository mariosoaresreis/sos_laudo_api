"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Package_1 = __importDefault(require("App/Models/Package"));
class PackagesController {
    async index({}) {
        const pack = await Package_1.default.all();
        return pack;
    }
    async create({ request }) {
        const body = request.only(['name', 'qtd_credits', 'plan_value']);
        await Package_1.default.create({
            name: body.name,
            qtd_credits: body.qtd_credits,
            plan_value: body.plan_value
        });
        return { status: 200 };
    }
    async show({ request }) {
        const packageId = request.param('id');
        const pack = await Package_1.default.find(packageId);
        return pack;
    }
    async update({ request }) {
        const packageId = request.param('id');
        const body = request.only(['name', 'qtd_credits', 'plan_value']);
        const pack = await Package_1.default.findOrFail(packageId);
        await pack.merge(body).save();
        return pack;
    }
    async destroy({ request }) {
        const packageId = request.param('id');
        const pack = await Package_1.default.findOrFail(packageId);
        await pack.delete();
        return true;
    }
}
exports.default = PackagesController;
//# sourceMappingURL=PackagesController.js.map