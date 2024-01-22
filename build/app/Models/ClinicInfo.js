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
class ClinicInfo extends Orm_1.BaseModel {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], ClinicInfo.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ClinicInfo.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ClinicInfo.prototype, "cidade", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ClinicInfo.prototype, "rua", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ClinicInfo.prototype, "bairro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ClinicInfo.prototype, "cep", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ClinicInfo.prototype, "nro", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ClinicInfo.prototype, "complemento", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ClinicInfo.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ClinicInfo.prototype, "updatedAt", void 0);
exports.default = ClinicInfo;
//# sourceMappingURL=ClinicInfo.js.map