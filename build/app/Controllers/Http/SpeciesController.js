"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const Specie_1 = __importDefault(require("App/Models/Specie"));
class SpeciesController {
    async index({}) {
        const especies = await Specie_1.default.all();
        return especies;
    }
    async create({ request }) {
        const body = request.only(['name', 'image', 'pos', 'enabled']);
        await Specie_1.default.create({
            name: body.name,
            pos: body.pos,
            image: body.image,
            enabled: body.enabled
        });
        return { status: 200 };
    }
    async show({ request }) {
        const especieId = request.param('id');
        const especie = await Specie_1.default.find(especieId);
        return especie;
    }
    async update({ request }) {
        const especieId = request.param('id');
        const body = request.only(['name', 'image', 'pos', 'enabled']);
        const especie = await Specie_1.default.findOrFail(especieId);
        await especie.merge(body).save();
        return especie;
    }
    async destroy({ request }) {
        const especieId = request.param('id');
        const especie = await Specie_1.default.findOrFail(especieId);
        await especie.delete();
        return true;
    }
    async getGroups({ request }) {
        const especieId = request.param('id');
        const especie = await Specie_1.default.findOrFail(especieId);
        let groups = await Database_1.default.query().from('groups').select('*').where('species_id', especieId).exec();
        groups = await Promise.all(groups.map(async (group) => {
            let regions = await Database_1.default.query().from('regions').select('*').where('group_id', group.id).exec();
            regions = regions.map((region) => {
                return {
                    id: region.id,
                    name: region.name,
                    price: region.price,
                    display_image: region.display_image,
                    body_id: region.body_id,
                    img_section_list: region.img_section_list
                };
            });
            return {
                id: group.id,
                name: group.name,
                regions
            };
        }));
        return {
            name: especie.name,
            image: especie.image,
            groups: groups
        };
        return groups;
    }
}
exports.default = SpeciesController;
//# sourceMappingURL=SpeciesController.js.map