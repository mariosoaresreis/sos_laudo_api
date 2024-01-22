"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const ExamAttachmentFile_1 = __importDefault(require("App/Models/ExamAttachmentFile"));
class ExamAttachmentFileController {
    async index({ request }) {
        const examId = request.param('id');
        const examImages = await Database_1.default.rawQuery(`
      SELECT id, file, type_file
      FROM exam_attachmentfiles
      WHERE exam_id = ${examId} 
      ORDER BY file ASC`);
        return examImages.rows;
    }
    async create({ request }) {
        const body = request.only(['exam_id', 'file', 'type_file']);
        await ExamAttachmentFile_1.default.create({
            exam_id: body.exam_id,
            file: body.file,
            type_file: body.type_file
        });
        return { status: 200 };
    }
    async destroy({ request }) {
        const fileId = request.param('id');
        const pack = await ExamAttachmentFile_1.default.findOrFail(fileId);
        await pack.delete();
        return true;
    }
}
exports.default = ExamAttachmentFileController;
//# sourceMappingURL=ExamAttachmentFile.js.map