"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const Group_1 = __importDefault(require("App/Models/Group"));
class GroupsController {
    async index({}) {
        const grupos = await Database_1.default.rawQuery('SELECT g.id, g.name, g.species_id, s.name as species_name, g.created_at, g.updated_at FROM groups g, species s WHERE g.species_id = s.id');
        return grupos.rows;
    }
    async create({ request }) {
        const body = request.only(['name', 'species_id']);
        await Group_1.default.create({
            name: body.name,
            species_id: body.species_id
        });
        return { status: 200 };
    }
    async show({ request }) {
        const grupoId = request.param('id');
        const grupo = await Group_1.default.find(grupoId);
        return grupo;
    }
    async update({ request }) {
        const grupoId = request.param('id');
        const body = request.only(['name', 'species_id']);
        const grupo = await Group_1.default.findOrFail(grupoId);
        await grupo.merge(body).save();
        return grupo;
    }
    async destroy({ request }) {
        const grupoId = request.param('id');
        const grupo = await Group_1.default.findOrFail(grupoId);
        await grupo.delete();
        return true;
    }
}
exports.default = GroupsController;
//# sourceMappingURL=GroupsController.js.map