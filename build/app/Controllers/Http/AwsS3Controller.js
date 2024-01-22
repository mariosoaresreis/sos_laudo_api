"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const Application_1 = __importDefault(require("@ioc:Adonis/Core/Application"));
const exam_attachmentfile_1 = __importDefault(require("App/Models/exam_attachmentfile"));
class AwsS3Controller {
    async uploadS3({ auth, request }) {
        const { examId } = request.only(['examId']);
        const file = request.file('file');
        const fileName = file?.clientName;
        const tmpFolder = `uploads/${auth.user?.id}/${examId}`;
        const fileLocation = `uploads/${auth.user?.id}/${examId}/${fileName}`;
        if (file) {
            await file.move(Application_1.default.tmpPath(`${tmpFolder}`));
            const parts = fileName.split(".");
            const fileExtension = parts[parts.length - 1];
            let newFileName = (0, uuid_1.v4)();
            newFileName = examId + '/' + newFileName + '.' + fileExtension;
            const s3 = new aws_sdk_1.default.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });
            const bucketName = process.env.AWS_BUCKET_NAME;
            const params = {
                Bucket: bucketName,
                Key: newFileName,
                Body: fs_1.default.readFileSync(`tmp/${fileLocation}`),
                ACL: 'public-read'
            };
            s3.upload(params, (err, data) => {
                if (err) {
                    console.error('Erro ao fazer upload do arquivo:', err);
                }
                else {
                    console.log('Upload bem-sucedido. URL do arquivo:', data.Location);
                }
            });
            await this.deleteTempFolder(tmpFolder);
            const register = await this.registerImage(examId, newFileName);
            return register;
        }
        else {
            return [-1];
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
    async registerImage(examId, newFileName) {
        try {
            await exam_attachmentfile_1.default.create({
                file: newFileName,
                comment: 'Enviado via SOS Laudos',
                exam_id: +examId
            });
            return [0];
        }
        catch {
            return [-1];
        }
    }
}
exports.default = AwsS3Controller;
//# sourceMappingURL=AwsS3Controller.js.map