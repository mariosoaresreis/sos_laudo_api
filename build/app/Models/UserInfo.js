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
class UserInfo extends Orm_1.BaseModel {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], UserInfo.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], UserInfo.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], UserInfo.prototype, "category", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_cuidador", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_veterinario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_laudador", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_examinador_veterinario", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], UserInfo.prototype, "is_examinador_radiologia", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserInfo.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], UserInfo.prototype, "updatedAt", void 0);
exports.default = UserInfo;
//# sourceMappingURL=UserInfo.js.map