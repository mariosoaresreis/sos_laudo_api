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
class exam_temporaryexam extends Orm_1.BaseModel {
}
exam_temporaryexam.connection = 'cedimtech';
exam_temporaryexam.table = 'exam_temporaryexam';
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", String)
], exam_temporaryexam.prototype, "study", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], exam_temporaryexam.prototype, "submitter_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_temporaryexam.prototype, "patient_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_temporaryexam.prototype, "accession_number", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_temporaryexam.prototype, "study_description", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", String)
], exam_temporaryexam.prototype, "study_datetime", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], exam_temporaryexam.prototype, "veterinary_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], exam_temporaryexam.prototype, "finished", void 0);
exports.default = exam_temporaryexam;
//# sourceMappingURL=exam_temporaryexam.js.map