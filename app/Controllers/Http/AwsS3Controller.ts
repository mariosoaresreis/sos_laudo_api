import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AWS from 'aws-sdk'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'
import exam_attachmentfile from 'App/Models/exam_attachmentfile'

export default class AwsS3Controller {

    public async uploadS3({ auth, request }: HttpContextContract) {

        const { examId } = request.only(['examId'])
        const file = request.file('file')

        const fileName = file?.clientName
        const tmpFolder = `uploads/${auth.user?.id!}/${examId}`
        const fileLocation = `uploads/${auth.user?.id!}/${examId}/${fileName}`
        
        if (file) {

            await file.move(Application.tmpPath(`${tmpFolder}`))

            const parts = fileName!.split(".");
            const fileExtension = parts[parts.length - 1];

            let newFileName = uuidv4()
            newFileName = examId + '/' + newFileName + '.' + fileExtension

            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            })
    
            const bucketName = process.env.AWS_BUCKET_NAME
    
            const params: AWS.S3.PutObjectRequest = {
                Bucket: bucketName!,
                Key: newFileName,
                Body: fs.readFileSync(`tmp/${fileLocation}`),
                ACL: 'public-read'
            }

            s3.upload(params, (err, data) => {
                if (err) {
                console.error('Erro ao fazer upload do arquivo:', err);
                } else {
                console.log('Upload bem-sucedido. URL do arquivo:', data.Location);
                }
            })

            await this.deleteTempFolder(tmpFolder)

            const register = await this.registerImage(examId, newFileName)

            return register

        } else {
            return [-1]
        }
    }

    public async deleteTempFolder(tmpFolder: string){
        if (fs.existsSync(Application.tmpPath(`${tmpFolder}`))) {
          try {
            fs.rmdirSync(Application.tmpPath(`${tmpFolder}`), { recursive: true })
            return 'Diretório excluído com sucesso.'
          } catch (error) {
            return error.message
          }
        } else {
          return 'O diretório não existe.'
        }
    }

    public async registerImage(examId: string, newFileName: string){
        try{

            await exam_attachmentfile.create({
                file: newFileName,
                comment: 'Enviado via SOS Laudos',
                exam_id: +examId
            })

            return [0]

        }catch{
            return [-1]
        }
    }

}