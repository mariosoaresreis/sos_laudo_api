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
class UserClinica extends Orm_1.BaseModel {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], UserClinica.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], UserClinica.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "country", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "clinic", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "cnpj", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "representant", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "representant_cpf", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "crmv_state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "crmv_number", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], UserClinica.prototype, "header", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserClinica.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserClinica.prototype, "updatedAt", void 0);
exports.default = UserClinica;
//# sourceMappingURL=UserClinica.js.map