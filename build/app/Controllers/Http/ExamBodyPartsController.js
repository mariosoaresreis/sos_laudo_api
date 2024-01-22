"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const units_exambodypart_1 = __importDefault(require("App/Models/units_exambodypart"));
class ExamBodyPartsController {
    async index({}) {
        const bodyParts = await units_exambodypart_1.default.all();
        return bodyParts;
    }
}
exports.default = ExamBodyPartsController;
//# sourceMappingURL=ExamBodyPartsController.js.map