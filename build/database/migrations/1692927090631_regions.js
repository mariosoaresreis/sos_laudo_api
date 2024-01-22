"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(require("@ioc:Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'regions';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('name');
            table.integer('image_count');
            table.integer('price');
            table.string('description');
            table.text('display_image');
            table.string('emergency_description');
            table.string('urgency_description');
            table.boolean('has_direction');
            table.integer('price_increase');
            table.integer('group_id').references('id').inTable('groups');
            table.json('section_list');
            table.json('img_section_list');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1692927090631_regions.js.map