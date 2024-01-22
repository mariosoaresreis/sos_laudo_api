"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
class IntegratorReportControlsController {
    async index({}) {
        const reportsPending = await Database_1.default.rawQuery(`
        SELECT id, exam_reference, status
        FROM report_controls
        WHERE status in ('waiting', 'assigned', 'created')
        ORDER BY created_at DESC
      `);
        for (const i of reportsPending.rows) {
            const cedimtech = await Database_1.default.connection('cedimtech').rawQuery(`
        SELECT id, state
        FROM exam_exam
        WHERE id = ${i.exam_reference}
        `);
            const reports = await Database_1.default.connection('cedimtech').rawQuery(`
        SELECT id 
        FROM report_report 
        WHERE exam_id = ${i.exam_reference} 
        ORDER BY id DESC`);
            let reportExist = false;
            if (reports.rowCount > 0) {
                reportExist = true;
            }
            if (cedimtech.rowCount) {
                const state = cedimtech.rows[0]?.state || '';
                let status = '';
                if (state === '1') {
                    status = 'created';
                }
                else if (state === '2') {
                    status = 'waiting';
                }
                else if (state === '3') {
                    status = 'assigned';
                }
                else if (state === '4') {
                    status = 'finish';
                }
                else if (state === '5') {
                    status = 'archived';
                }
                else {
                    status = 'archived';
                }
                try {
                    await Database_1.default.rawQuery(`
            UPDATE report_controls 
            set status = '${status}', report_exist = '${reportExist}'
            WHERE id = ${i.id}
            `);
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                await Database_1.default.rawQuery(`
        UPDATE report_controls 
        set status = 'not found', report_exist = 'false'
        WHERE id = ${i.id}
        `);
            }
            return 'done';
        }
    }
}
exports.default = IntegratorReportControlsController;
//# sourceMappingURL=IntegratorReportControlsController.js.map