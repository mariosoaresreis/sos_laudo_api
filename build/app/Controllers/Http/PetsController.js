"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const Pet_1 = __importDefault(require("App/Models/Pet"));
class PetsController {
    async index({ request, auth }) {
        const userId = auth?.user?.id;
        const query = request.qs();
        if (!query.species_id) {
            const pets = await Database_1.default.rawQuery('SELECT p.id, p.name, p.birth, p.gender, p.image, p.species_id, p.breed_id, s.name as species_name, p.owner_id, p.created_at, p.updated_at FROM pets p, species s WHERE p.species_id = s.id AND p.owner_id = ?;', [userId]);
            return pets.rows;
        }
        else {
            const pets = await Database_1.default.rawQuery(`
        SELECT p.id, p.name, p.birth, p.gender, p.species_id, p.breed_id, p.image, s.name as species_name, p.owner_id, p.created_at, p.updated_at 
        FROM pets p, species s 
        WHERE p.species_id = s.id 
        AND p.owner_id = ? 
        AND p.species_id = ?;`, [userId, query.species_id]);
            return pets.rows;
        }
    }
    async create({ request, auth }) {
        const body = request.only(['name', 'birth', 'gender', 'species_id', 'breed_id', 'image', 'owner_id']);
        const userId = auth?.user?.id;
        const owner_id = body.owner_id !== '0' && body.owner_id !== null && body.owner_id !== undefined ? body.owner_id : userId;
        await Pet_1.default.create({
            name: body.name,
            birth: body.birth,
            gender: body.gender,
            species_id: body.species_id,
            breed_id: body.breed_id,
            owner_id: owner_id,
            image: body.image
        });
        return { status: 200 };
    }
    async show({ request, auth }) {
        const petId = request.param('id');
        const userId = auth?.user?.id;
        const pet = await Pet_1.default.find(petId);
        if (pet?.owner_id != userId)
            return { status: 401 };
        return pet;
    }
    async update({ request, auth }) {
        const petId = request.param('id');
        const userId = auth?.user?.id;
        const body = request.only(['name', 'birth', 'gender', 'species_id', 'breed_id', 'image']);
        const pet = await Pet_1.default.findOrFail(petId);
        if (pet?.owner_id != userId)
            return { status: 401 };
        await pet.merge(body).save();
        return pet;
    }
    async destroy({ request, auth }) {
        const petId = request.param('id');
        const userId = auth?.user?.id;
        const pet = await Pet_1.default.findOrFail(petId);
        if (pet.owner_id != userId)
            return { status: 401 };
        await pet.delete();
        return true;
    }
    async listPets({ auth }) {
        const userId = auth.user?.id;
        const isAdmin = auth.user?.is_adm;
        if (isAdmin) {
            const pets = await Database_1.default.rawQuery(`
      SELECT p.id, p.name, p.birth, p.gender, p.species_id, p.breed_id, p.image, s.name as species_name, b.name as breed_name, p.owner_id, u.name as owner_name, p.created_at, p.updated_at 
      FROM pets p, species s, users u, breeds b
      WHERE p.species_id = s.id 
      AND b.id = p.breed_id
      AND p.owner_id = u.id`);
            return pets.rows;
        }
        else {
            const pets = await Database_1.default.rawQuery(`
        SELECT p.id, p.name, p.birth, p.gender, p.species_id, p.breed_id, p.image, s.name as species_name, b.name as breed_name, p.owner_id, p.created_at, p.updated_at 
        FROM pets p, species s, breeds b
        WHERE p.species_id = s.id 
        AND b.id = p.breed_id
        AND p.owner_id = ${userId}`);
            return pets.rows;
        }
    }
}
exports.default = PetsController;
//# sourceMappingURL=PetsController.js.map