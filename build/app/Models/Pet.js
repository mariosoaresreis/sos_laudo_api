"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = require("@ioc:Adonis/Lucid/Orm");
class Pet extends Orm_1.BaseModel {
    static async validateGender(pet) {
        const gender = String(pet.gender).toUpperCase();
        if (!['M', 'F'].includes(gender)) {
            pet.gender = 'M';
        }
        else {
            pet.gender = gender;
        }
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Pet.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Pet.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Date)
], Pet.prototype, "birth", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Pet.prototype, "gender", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Pet.prototype, "species_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Pet.prototype, "breed_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Pet.prototype, "owner_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Pet.prototype, "image", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Pet.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Pet.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.beforeSave)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pet]),
    __metadata("design:returntype", Promise)
], Pet, "validateGender", null);
exports.default = Pet;
//# sourceMappingURL=Pet.js.map