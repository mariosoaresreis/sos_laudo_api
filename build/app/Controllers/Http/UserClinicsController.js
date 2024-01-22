"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserClinic_1 = __importDefault(require("App/Models/UserClinic"));
class UserClinicsController {
    async index({}) {
        const userClinics = await UserClinic_1.default.all();
        return userClinics;
    }
    async create({ request }) {
        const body = request.only(['user_id', 'clinic_id']);
        await UserClinic_1.default.create({
            user_id: body.user_id,
            clinic_id: body.clinic_id
        });
        return { status: 200 };
    }
    async show({ request }) {
        const userClinicId = request.param('id');
        const userClinic = await UserClinic_1.default.find(userClinicId);
        return userClinic;
    }
    async update({ request }) {
        const userClinicId = request.param('id');
        const body = request.only(['user_id', 'clinic_id']);
        const userClinic = await UserClinic_1.default.findOrFail(userClinicId);
        await userClinic.merge(body).save();
        return userClinic;
    }
    async destroy({ request }) {
        const userClinicId = request.param('id');
        const userClinic = await UserClinic_1.default.findOrFail(userClinicId);
        await userClinic.delete();
        return true;
    }
}
exports.default = UserClinicsController;
//# sourceMappingURL=UserClinicsController.js.map