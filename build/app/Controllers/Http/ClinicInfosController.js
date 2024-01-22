"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClinicInfo_1 = __importDefault(require("App/Models/ClinicInfo"));
class ClinicInfosController {
    async index({}) {
        const infos = await ClinicInfo_1.default.all();
        return infos;
    }
    async create({ request }) {
        const body = request.only(['name', 'cidade', 'rua', 'bairro', 'cep', 'nro', 'complemento']);
        await ClinicInfo_1.default.create({
            name: body.name,
            cidade: body.cidade,
            rua: body.rua,
            bairro: body.bairro,
            cep: body.cep,
            nro: body.nro,
            complemento: body.complemento
        });
        return { status: 200 };
    }
    async show({ request }) {
        const clinicId = request.param('id');
        const clinicInfo = await ClinicInfo_1.default.find(clinicId);
        return clinicInfo;
    }
    async update({ request }) {
        const clinicId = request.param('id');
        const body = request.only(['name', 'cidade', 'rua', 'bairro', 'cep', 'nro', 'complemento']);
        const clinicInfo = await ClinicInfo_1.default.findOrFail(clinicId);
        await clinicInfo.merge(body).save();
        return clinicInfo;
    }
    async destroy({ request }) {
        const clinicId = request.param('id');
        const clinicInfo = await ClinicInfo_1.default.findOrFail(clinicId);
        await clinicInfo.delete();
        return true;
    }
}
exports.default = ClinicInfosController;
//# sourceMappingURL=ClinicInfosController.js.map