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
const luxon_1 = require("luxon");
class exam_exam extends Orm_1.BaseModel {
}
exam_exam.connection = 'cedimtech';
exam_exam.table = 'exam_exam';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], exam_exam.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exam.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "age", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exam.prototype, "age_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exam.prototype, "gender", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exam.prototype, "historic", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exam.prototype, "suspicion", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_exam.prototype, "state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "breed_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], exam_exam.prototype, "requester_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "specie_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "submitter_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_exam.prototype, "sedated", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_exam.prototype, "require_report", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "age_month", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "customer_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], exam_exam.prototype, "veterinary_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], exam_exam.prototype, "clinic_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "linked_exam", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_exam.prototype, "emergency", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_exam.prototype, "unit_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Array)
], exam_exam.prototype, "selected_body_parts", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", luxon_1.DateTime)
], exam_exam.prototype, "state_update", void 0);
exports.default = exam_exam;
//# sourceMappingURL=exam_exam.js.map