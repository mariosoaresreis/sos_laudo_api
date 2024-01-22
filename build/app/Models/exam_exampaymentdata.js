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
const Orm_1 = require("@ioc:Adonis/Lucid/Orm");
class exam_exampaymentdata extends Orm_1.BaseModel {
}
exam_exampaymentdata.connection = 'cedimtech';
exam_exampaymentdata.table = 'exam_exampaymentdata';
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "auto_price", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "price", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "discount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exampaymentdata.prototype, "discount_reason", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exampaymentdata.prototype, "nearby_city", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "nearby_city_cost", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_exampaymentdata.prototype, "sunday_or_holiday", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_exampaymentdata.prototype, "on_duty", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "duty_tax", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exampaymentdata.prototype, "duty_period", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "duty_trx", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exampaymentdata.prototype, "exam_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_exampaymentdata.prototype, "money_payment", void 0);
exports.default = exam_exampaymentdata;
//# sourceMappingURL=exam_exampaymentdata.js.map