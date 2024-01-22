import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import fetch from 'node-fetch';
import fs from 'fs';
import Database from '@ioc:Adonis/Lucid/Database';
import exam_temporaryexam from 'App/Models/exam_temporaryexam';
import dicom_dicom from 'App/Models/dicom_dicom';
import { format, parse } from 'date-fns';
import exam_exam from 'App/Models/exam_exam';
import Application from '@ioc:Adonis/Core/Application'
import exam_examstatechanges from 'App/Models/exam_examstatechanges';
import exam_exampaymentdata from 'App/Models/exam_exampaymentdata';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'
import exam_attachmentfile from 'App/Models/exam_attachmentfile';

export default class OrthancCedimController {

  // public async index({ request }: HttpContextContract) {
  public async SendImageToOrthanc(examId, fileDicom) {

    try {

      // const fileData = fs.readFileSync('/Users/amador/Downloads/CR000000.dcm');
      // const fileData = fs.readFileSync('/Users/amador/Downloads/CR000000.zip');

      const fileData = fs.readFileSync(`tmp/${fileDicom}`)

      const url = `${process.env.ORTHANC_SOS_LAUDOS}/instances`

      const response = await fetch(url, {
        method: 'POST',
        body: fileData,
        headers: {
          'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
          'Content-Type': 'application/dicom',
        },
      });

      if (response.ok) {

          let result: number[] = []

          const responseData = await response.text();
          const item = JSON.parse(responseData)

          // 'AlreadyStored'
          // 'Success'

          if ( Array.isArray(item) ){

            for ( const it of item ){    
              const res = await this.registerInstance(it, examId)
              result = result.concat(result, +res)
            }

          }else{
            const res = await this.registerInstance(item, examId)
            result = res
          }

          return result

        }else{

        return [-1]

      }

    } catch (error) {
      return [-2] // { status: 503, message: error }
    }
  }

  public async registerInstance(it: any, examId: string){

    try{

      const study = await this.getStudyInfo(it.ParentStudy)
      const studyInfo = await this.searchStudyStorageInCedimTech(study)

      if (studyInfo == '0'){

        await exam_temporaryexam.create({
          study: study.ID, 
          submitter_id: study.MainDicomTags.InstitutionName, // 40,
          patient_name: study.PatientMainDicomTags.PatientName, 
          accession_number: study.MainDicomTags.AccessionNumber, // '40',
          study_description: study.MainDicomTags.StudyDescription,
          study_datetime: await this.concatenateStudyDate(study.MainDicomTags.StudyDate, study.MainDicomTags.StudyTime),
          veterinary_name: study.MainDicomTags.ReferringPhysicianName, // 'SOS LAUDOS',
          finished: true
        })

        const series: string[] = study.Series
        for ( const i of series ){

          const instances: string[] = await this.getSerieInstancesInfo(i)
          for ( const f of instances ){

            const checkInstance = await this.checkDicomInstance(f)

            if ( checkInstance == '0' ){

              // generate jpg file for preview
              await this.generatePreviewImage(f, examId)

              await dicom_dicom.create({
                instance: f,
                exam_id: +examId,
                temporary_exam_id: study.ID
              })

            }

          }
        }

        return [0]

      }else{

        const exam_id = await this.getStudyStorageInCedimTech(study)
        return [+exam_id]

      }

    }catch(error){
      return [-1]
    }

  }
  
  public async generatePreviewImage(instance: string, examId: string) {
    try {

      const url = `${process.env.ORTHANC_SOS_LAUDOS}/instances/${instance}/preview`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
          'Content-Type': 'application/dicom',
        },
      });

      if (response.ok) {

        const imageBuffer = await response.arrayBuffer()
        
        let newFileName = uuidv4()
        newFileName = examId + '/' + newFileName + '.' + 'jpeg'

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })

        const bucketName = process.env.AWS_BUCKET_NAME

        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucketName!,
            Key: newFileName,
            Body:  Buffer.from(imageBuffer),
            ACL: 'public-read'
        }

        s3.upload(params, async (err, data) => {
            if (err) {
            console.error('Erro ao fazer upload do arquivo:', err);
            } else {

              await exam_attachmentfile.create({
                  file: newFileName,
                  comment: 'Enviado via SOS Laudos',
                  exam_id: +examId
              })

            }
        })
       
      }

    } catch (error) {
      return (error)
    }
  }

  // public async getStudyInfo({ request }: HttpContextContract) {
  public async getStudyInfo(study: string) {
    try {

      const url = `${process.env.ORTHANC_SOS_LAUDOS}/studies/${study}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
          'Content-Type': 'application/dicom',
        },
      });

      if (response.ok) {
        const responseData = await response.text();
        return(JSON.parse(responseData))
      } else {
        return (response.statusText)
      }
    } catch (error) {
      return (error)
    }
  }

  public async getSerieInstancesInfo(serie: string) {
    try {

      const url = `${process.env.ORTHANC_SOS_LAUDOS}/series/${serie}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${process.env.ORTHANC_SOS_LAUDOS_TKN}`,
          'Content-Type': 'application/dicom',
        },
      });

      if (response.ok) {
        const responseData = await response.text();
        return(JSON.parse(responseData).Instances)
      } else {
        return (response.statusText)
      }
    } catch (error) {
      return (error)
    }
  }

  public async searchStudyStorageInCedimTech(study: any){
    try{

      const res = await Database.connection('cedimtech').rawQuery(`
        SELECT count(study) as counter 
        FROM exam_temporaryexam
        WHERE study = '${study?.ID}'
      `)

      /*
        AND submitter_id = '${study.MainDicomTags.InstitutionName}'
        AND patient_name = '${study?.PatientMainDicomTags.PatientName}'
        AND study_description = '${study?.MainDicomTags.StudyDescription}'
        AND veterinary_name = '${study?.MainDicomTags.ReferringPhysicianName}'
      */

      return res.rows[0].counter

    }catch(error){
      return { status: 500, message: error }
    }
  }

  public async getStudyStorageInCedimTech(study: any){
    try{

      const res = await Database.connection('cedimtech').rawQuery(`
        SELECT exam_id 
        FROM dicom_dicom
        WHERE temporary_exam_id = '${study?.ID}'
      `)

      return res.rows[0]?.exam_id || 0

    }catch(error){
      return { status: 500, message: error }
    }
  }

  public async checkDicomInstance(id: string){
    try{

      const res = await Database.connection('cedimtech').rawQuery(`
        SELECT count(instance) as counter 
        FROM dicom_dicom 
        WHERE instance = '${id}'
      `)

      return res.rows[0].counter

    }catch(error){
      return { status: 500, message: error }
    }
  }

  public async deleteTemporaryExam(id: string){
    try{

      // const res = await Database.connection('cedimtech').rawQuery(`
      //  DELETE dicom_dicom WHERE instance = '${id}'
      //`)

    }catch(error){
      return { status: 500, message: error }
    }
  }

  public async deleteDicomInstance(id: string){
    try{

      //const res = await Database.connection('cedimtech').rawQuery(`
      //  DELETE dicom_dicom WHERE temporary_exam_id = '${id}'
      //`)

    }catch(error){
      return { status: 500, message: error }
    }
  }

  public async concatenateStudyDate(dt: string, hr: string){

    const year = dt.substr(0, 4)
    const month = dt.substr(4, 2)
    const day = dt.substr(6, 2)
    const hour = hr.substr(0, 2)
    const minute = hr.substr(2, 2)
    const second = hr.substr(4, 2)
    
    const dataHoraString = `${year}-${month}-${day} ${hour}:${minute}:${second}`
    const dataHoraDate = parse(dataHoraString, "yyyy-MM-dd HH:mm:ss", new Date())
    const dataHoraFormatada = format(dataHoraDate, "yyy-MM-dd HH:mm:ss")
    
    return dataHoraFormatada

  }

  public async createExamCedimTech({ request, response }: HttpContextContract) {

    try{

      const currentDate = new Date()

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
        // 'require_report',
        'age_month',
        'customer_id',
        'veterinary_id',
        'clinic_id',
        // 'linked_exam',
        'emergency',
        // 'unit_id',
        'selected_body_parts',
        // 'state_update'
      ])

      const newExam = new exam_exam()
      newExam.name = body.name                               // '>> NAO LAUDAR <<'
      newExam.age = body.age                                 // 0
      newExam.age_type = body.age_type                       // 'Y'
      newExam.gender = body.gender                           // 'M'
      newExam.historic = body.historic                       // '-->> NAO LAUDAR <<-'
      newExam.suspicion = body.suspicion                     // '-->> NAO LAUDAR <<-'
      newExam.state = body.state                             // '2'
      newExam.breed_id = body.breed_id                       // 327
      newExam.requester_id = body.requester_id               // null
      newExam.specie_id = body.specie_id                     // 7
      newExam.submitter_id = body.submitter_id               // 2
      newExam.sedated = body.sedated                         // false
      newExam.require_report = true
      newExam.age_month = body.age_month                     // 1
      newExam.customer_id = body.customer_id                 // 75537               // 84711  --> SOS LAUDOS
      newExam.veterinary_id = body.veterinary_id
      newExam.clinic_id = body.clinic_id
      newExam.linked_exam = 0
      newExam.emergency = body.emergency                     // false
      newExam.unit_id = 50                                   // 50, // --> unidade 40 - SOS LAUDOS
      newExam.selected_body_parts = body.selected_body_parts // [22]
      newExam.state_update = new Date(currentDate.toISOString()); // format(new Date(), "yyy-MM-dd HH:mm:ss")

      await newExam.save()

      try{

        // Adiciona forma de pagamento
        const newPayment = new exam_exampaymentdata()
        newPayment.auto_price = 0
        newPayment.price = 0
        newPayment.discount = 0
        newPayment.discount_reason = ' '
        newPayment.nearby_city = 'Sem deslocamento'
        newPayment.nearby_city_cost = 0
        newPayment.sunday_or_holiday = false
        newPayment.on_duty = false
        newPayment.duty_tax = 0
        newPayment.duty_period = ' '
        newPayment.exam_id = +newExam.id
        newPayment.money_payment = false

        await newPayment.save()

      }catch(error){
        console.log(error)
      }

      // Adiciona status do item
      const newState = new exam_examstatechanges()
      newState.state = 1
      newState.time = format(new Date(), "yyy-MM-dd HH:mm:ss")
      newState.exam_id = newExam.id 

      await newState.save()

      return { 
        status: 200, 
        exam_id: newExam.id 
      }

    }catch(error){
      return error.message
    }
  }

  public async updateExamCedimTech({ request }: HttpContextContract) {

    try{

      const exam_id = request.param('id')
      const body = request.only(['state'])
      const exam = await exam_exam.findOrFail(exam_id)
      await exam.merge(body).save()

      // Adiciona status do item      
      const newState = new exam_examstatechanges()
      newState.state = 1,
      newState.time = format(new Date(), "yyy-MM-dd HH:mm:ss"),
      newState.exam_id = body.state

      await newState.save()

      return { 
        status: 200
      }

    }catch(error){
      return error.message
    }
  }
  

  public async uploadDicom({ auth, request, response }: HttpContextContract) {

    const { examId } = request.only(['examId'])
    const fileDicom = request.file('file')

    const fileName = fileDicom?.clientName
    const tmpFolder = `uploads/${auth.user?.id!}/${examId}`
    const fileDicomLocation = `uploads/${auth.user?.id!}/${examId}/${fileName}`
  
    if (fileDicom) {

      await fileDicom.move(Application.tmpPath(`${tmpFolder}`))

      const res = await this.SendImageToOrthanc(examId, fileDicomLocation)

      await this.deleteTempFolder(tmpFolder)

      return res

    } else {

      return [-2]

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
  
}