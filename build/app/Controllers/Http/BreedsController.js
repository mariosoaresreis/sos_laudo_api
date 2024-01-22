"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const Breed_1 = __importDefault(require("App/Models/Breed"));
class BreedsController {
    async index({}) {
        const breeds = await Database_1.default.rawQuery(`
      SELECT b.id, b.name, b.specie_id, b.available, s.name as specie_name 
      FROM breeds b, species s
      WHERE s.id = b.specie_id
      `);
        return breeds.rows;
    }
    async create({ request }) {
        const body = request.only(['name', 'specie_id']);
        await Breed_1.default.create({
            name: body.name,
            specie_id: body.specie_id,
            available: true
        });
        return { status: 200 };
    }
    async show({ request }) {
        const breedId = request.param('id');
        const breed = await Breed_1.default.find(breedId);
        return breed;
    }
    async update({ request }) {
        const breedId = request.param('id');
        const body = request.only(['name', 'specie_id']);
        const breed = await Breed_1.default.findOrFail(breedId);
        await breed.merge(body).save();
        return breed;
    }
    async destroy({ request }) {
        const breedId = request.param('id');
        const breed = await Breed_1.default.findOrFail(breedId);
        await breed.delete();
        return true;
    }
}
exports.default = BreedsController;
//# sourceMappingURL=BreedsController.js.map