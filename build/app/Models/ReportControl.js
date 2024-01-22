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
class ReportControl extends Orm_1.BaseModel {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], ReportControl.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "specie_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "specie_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "pet_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "region_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "history", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "suspicion", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "clinic", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "exam_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "exam_price", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "exam_image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "plantao", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "urgent", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ReportControl.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "reference_report", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "veterinary_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "exam_reference", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "exam_old", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ReportControl.prototype, "report_exist", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ReportControl.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ReportControl.prototype, "updatedAt", void 0);
exports.default = ReportControl;
//# sourceMappingURL=ReportControl.js.map