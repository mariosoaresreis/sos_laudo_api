"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Report_1 = __importDefault(require("App/Models/Report"));
class ReportsController {
    async index({}) {
        const laudos = await Report_1.default.all();
        return laudos;
    }
    async create({ request }) {
        const body = request.only(['pet_id', 'history', 'report', 'region_id', 'image_list']);
        await Report_1.default.create({
            pet_id: body.pet_id,
            history: body.history,
            report: body.report,
            region_id: body.region_id,
            image_list: JSON.stringify(body.image_list)
        });
        return { status: 200 };
    }
    async show({ request }) {
        const laudoId = request.param('id');
        const laudo = await Report_1.default.find(laudoId);
        return laudo;
    }
    async update({ request }) {
        const laudoId = request.param('id');
        const body = request.only(['pet_id', 'history', 'report', 'region_id', 'image_list']);
        const laudo = await Report_1.default.findOrFail(laudoId);
        await laudo.merge(body).save();
        return laudo;
    }
    async destroy({ request }) {
        const laudoId = request.param('id');
        const laudo = await Report_1.default.findOrFail(laudoId);
        await laudo.delete();
        return true;
    }
}
exports.default = ReportsController;
//# sourceMappingURL=ReportsController.js.map