"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const Database_1 = __importDefault(require("@ioc:Adonis/Lucid/Database"));
const exam_temporaryexam_1 = __importDefault(require("App/Models/exam_temporaryexam"));
const dicom_dicom_1 = __importDefault(require("App/Models/dicom_dicom"));
const date_fns_1 = require("date-fns");
const exam_exam_1 = __importDefault(require("App/Models/exam_exam"));
const Application_1 = __importDefault(require("@ioc:Adonis/Core/Application"));
const exam_examstatechanges_1 = __importDefault(require("App/Models/exam_examstatechanges"));
const exam_exampaymentdata_1 = __importDefault(require("App/Models/exam_exampaymentdata"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const exam_attachmentfile_1 = __importDefault(require("App/Models/exam_attachmentfile"));
class OrthancCedimController {
    async SendImageToOrthanc(examId, fileDicom) {
        try {
            const fileData = fs_1.default.readFileSync(`tmp/${fileDicom}`);
            const url = `${process.env.ORTHANC_SOS_LAUDOS}/instances`;
            const response = await (0, node_fetch_1.default)(url, {
                method: 'POST',
                body: fileData,
                headers: {
                    'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
                    'Content-Type': 'application/dicom',
                },
            });
            if (response.ok) {
                let result = [];
                const responseData = await response.text();
                const item = JSON.parse(responseData);
                if (Array.isArray(item)) {
                    for (const it of item) {
                        const res = await this.registerInstance(it, examId);
                        result = result.concat(result, +res);
                    }
                }
                else {
                    const res = await this.registerInstance(item, examId);
                    result = res;
                }
                return result;
            }
            else {
                return [-1];
            }
        }
        catch (error) {
            return [-2];
        }
    }
    async registerInstance(it, examId) {
        try {
            const study = await this.getStudyInfo(it.ParentStudy);
            const studyInfo = await this.searchStudyStorageInCedimTech(study);
            if (studyInfo == '0') {
                await exam_temporaryexam_1.default.create({
                    study: study.ID,
                    submitter_id: study.MainDicomTags.InstitutionName,
                    patient_name: study.PatientMainDicomTags.PatientName,
                    accession_number: study.MainDicomTags.AccessionNumber,
                    study_description: study.MainDicomTags.StudyDescription,
                    study_datetime: await this.concatenateStudyDate(study.MainDicomTags.StudyDate, study.MainDicomTags.StudyTime),
                    veterinary_name: study.MainDicomTags.ReferringPhysicianName,
                    finished: true
                });
                const series = study.Series;
                for (const i of series) {
                    const instances = await this.getSerieInstancesInfo(i);
                    for (const f of instances) {
                        const checkInstance = await this.checkDicomInstance(f);
                        if (checkInstance == '0') {
                            await this.generatePreviewImage(f, examId);
                            await dicom_dicom_1.default.create({
                                instance: f,
                                exam_id: +examId,
                                temporary_exam_id: study.ID
                            });
                        }
                    }
                }
                return [0];
            }
            else {
                const exam_id = await this.getStudyStorageInCedimTech(study);
                return [+exam_id];
            }
        }
        catch (error) {
            return [-1];
        }
    }
    async generatePreviewImage(instance, examId) {
        try {
            const url = `${process.env.ORTHANC_SOS_LAUDOS}/instances/${instance}/preview`;
            const response = await (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
                    'Content-Type': 'application/dicom',
                },
            });
            if (response.ok) {
                const imageBuffer = await response.arrayBuffer();
                let newFileName = (0, uuid_1.v4)();
                newFileName = examId + '/' + newFileName + '.' + 'jpeg';
                const s3 = new aws_sdk_1.default.S3({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                });
                const bucketName = process.env.AWS_BUCKET_NAME;
                const params = {
                    Bucket: bucketName,
                    Key: newFileName,
                    Body: Buffer.from(imageBuffer),
                    ACL: 'public-read'
                };
                s3.upload(params, async (err, data) => {
                    if (err) {
                        console.error('Erro ao fazer upload do arquivo:', err);
                    }
                    else {
                        await exam_attachmentfile_1.default.create({
                            file: newFileName,
                            comment: 'Enviado via SOS Laudos',
                            exam_id: +examId
                        });
                    }
                });
            }
        }
        catch (error) {
            return (error);
        }
    }
    async getStudyInfo(study) {
        try {
            const url = `${process.env.ORTHANC_SOS_LAUDOS}/studies/${study}`;
            const response = await (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
                    'Content-Type': 'application/dicom',
                },
            });
            if (response.ok) {
                const responseData = await response.text();
                return (JSON.parse(responseData));
            }
            else {
                return (response.statusText);
            }
        }
        catch (error) {
            return (error);
        }
    }
    async getSerieInstancesInfo(serie) {
        try {
            const url = `${process.env.ORTHANC_SOS_LAUDOS}/series/${serie}`;
            const response = await (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
                    'Content-Type': 'application/dicom',
                },
            });
            if (response.ok) {
                const responseData = await response.text();
                return (JSON.parse(responseData).Instances);
            }
            else {
                return (response.statusText);
            }
        }
        catch (error) {
            return (error);
        }
    }
    async searchStudyStorageInCedimTech(study) {
        try {
            const res = await Database_1.default.connection('cedimtech').rawQuery(`
        SELECT count(study) as counter 
        FROM exam_temporaryexam
        WHERE study = '${study?.ID}'
      `);
            return res.rows[0].counter;
        }
        catch (error) {
            return { status: 500, message: error };
        }
    }
    async getStudyStorageInCedimTech(study) {
        try {
            const res = await Database_1.default.connection('cedimtech').rawQuery(`
        SELECT exam_id 
        FROM dicom_dicom
        WHERE temporary_exam_id = '${study?.ID}'
      `);
            return res.rows[0]?.exam_id || 0;
        }
        catch (error) {
            return { status: 500, message: error };
        }
    }
    async checkDicomInstance(id) {
        try {
            const res = await Database_1.default.connection('cedimtech').rawQuery(`
        SELECT count(instance) as counter 
        FROM dicom_dicom 
        WHERE instance = '${id}'
      `);
            return res.rows[0].counter;
        }
        catch (error) {
            return { status: 500, message: error };
        }
    }
    async deleteTemporaryExam(id) {
        try {
        }
        catch (error) {
            return { status: 500, message: error };
        }
    }
    async deleteDicomInstance(id) {
        try {
        }
        catch (error) {
            return { status: 500, message: error };
        }
    }
    async concatenateStudyDate(dt, hr) {
        const year = dt.substr(0, 4);
        const month = dt.substr(4, 2);
        const day = dt.substr(6, 2);
        const hour = hr.substr(0, 2);
        const minute = hr.substr(2, 2);
        const second = hr.substr(4, 2);
        const dataHoraString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        const dataHoraDate = (0, date_fns_1.parse)(dataHoraString, "yyyy-MM-dd HH:mm:ss", new Date());
        const dataHoraFormatada = (0, date_fns_1.format)(dataHoraDate, "yyy-MM-dd HH:mm:ss");
        return dataHoraFormatada;
    }
    async createExamCedimTech({ request, response }) {
        try {
            const currentDate = new Date();
            const body = request.only([
                'name',
                'age',
                'age_type',
                'gender',
                'historic',
                'suspicion',
                'state',
                'breed_id',
                'requester_id',
                'specie_id',
                'submitter_id',
                'sedated',
                'age_month',
                'customer_id',
                'veterinary_id',
                'clinic_id',
                'emergency',
                'selected_body_parts',
            ]);
            const newExam = new exam_exam_1.default();
            newExam.name = body.name;
            newExam.age = body.age;
            newExam.age_type = body.age_type;
            newExam.gender = body.gender;
            newExam.historic = body.historic;
            newExam.suspicion = body.suspicion;
            newExam.state = body.state;
            newExam.breed_id = body.breed_id;
            newExam.requester_id = body.requester_id;
            newExam.specie_id = body.specie_id;
            newExam.submitter_id = body.submitter_id;
            newExam.sedated = body.sedated;
            newExam.require_report = true;
            newExam.age_month = body.age_month;
            newExam.customer_id = body.customer_id;
            newExam.veterinary_id = body.veterinary_id;
            newExam.clinic_id = body.clinic_id;
            newExam.linked_exam = 0;
            newExam.emergency = body.emergency;
            newExam.unit_id = 50;
            newExam.selected_body_parts = body.selected_body_parts;
            newExam.state_update = new Date(currentDate.toISOString());
            await newExam.save();
            try {
                const newPayment = new exam_exampaymentdata_1.default();
                newPayment.auto_price = 0;
                newPayment.price = 0;
                newPayment.discount = 0;
                newPayment.discount_reason = ' ';
                newPayment.nearby_city = 'Sem deslocamento';
                newPayment.nearby_city_cost = 0;
                newPayment.sunday_or_holiday = false;
                newPayment.on_duty = false;
                newPayment.duty_tax = 0;
                newPayment.duty_period = ' ';
                newPayment.exam_id = +newExam.id;
                newPayment.money_payment = false;
                await newPayment.save();
            }
            catch (error) {
                console.log(error);
            }
            const newState = new exam_examstatechanges_1.default();
            newState.state = 1;
            newState.time = (0, date_fns_1.format)(new Date(), "yyy-MM-dd HH:mm:ss");
            newState.exam_id = newExam.id;
            await newState.save();
            return {
                status: 200,
                exam_id: newExam.id
            };
        }
        catch (error) {
            return error.message;
        }
    }
    async updateExamCedimTech({ request }) {
        try {
            const exam_id = request.param('id');
            const body = request.only(['state']);
            const exam = await exam_exam_1.default.findOrFail(exam_id);
            await exam.merge(body).save();
            const newState = new exam_examstatechanges_1.default();
            newState.state = 1,
                newState.time = (0, date_fns_1.format)(new Date(), "yyy-MM-dd HH:mm:ss"),
                newState.exam_id = body.state;
            await newState.save();
            return {
                status: 200
            };
        }
        catch (error) {
            return error.message;
        }
    }
    async uploadDicom({ auth, request, response }) {
        const { examId } = request.only(['examId']);
        const fileDicom = request.file('file');
        const fileName = fileDicom?.clientName;
        const tmpFolder = `uploads/${auth.user?.id}/${examId}`;
        const fileDicomLocation = `uploads/${auth.user?.id}/${examId}/${fileName}`;
        if (fileDicom) {
            await fileDicom.move(Application_1.default.tmpPath(`${tmpFolder}`));
            const res = await this.SendImageToOrthanc(examId, fileDicomLocation);
            await this.deleteTempFolder(tmpFolder);
            return res;
        }
        else {
            return [-2];
        }
    }
    async deleteTempFolder(tmpFolder) {
        if (fs_1.default.existsSync(Application_1.default.tmpPath(`${tmpFolder}`))) {
            try {
                fs_1.default.rmdirSync(Application_1.default.tmpPath(`${tmpFolder}`), { recursive: true });
                return 'Diretório excluído com sucesso.';
            }
            catch (error) {
                return error.message;
            }
        }
        else {
            return 'O diretório não existe.';
        }
    }
}
exports.default = OrthancCedimController;
//# sourceMappingURL=OrthancCedimController.js.map