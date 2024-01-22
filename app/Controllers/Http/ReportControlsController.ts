import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import ReportControl from 'App/Models/ReportControl'
import axios from 'axios';

export default class ReportControlsController {

  public async index({ auth }: HttpContextContract) {
    const userId = auth?.user?.id
    const isAdmin = auth?.user?.is_adm
  
    let variableUser = `WHERE user_id = ${userId!} AND p.id = r.pet_id AND b.id = p.breed_id ORDER BY created_at DESC;`

    if ( isAdmin ){
      variableUser = `WHERE p.id = r.pet_id AND b.id = p.breed_id ORDER BY created_at DESC;`
    } 
    
    const reports = await Database.rawQuery(`
      SELECT r.id, r.region_id, r.exam_image, r.exam_reference, r.specie_name, r.report_exist, r.exam_price, TO_CHAR(r.created_at AT TIME ZONE 'BRT', 'DD/MM/YYYY HH24:MI:SS') as created_at, p.name as pet_name, r.status, r.plantao, r.urgent, b.name as breed_name
      FROM report_controls r, pets p, breeds b
      ${variableUser}`
    )

    const processedReports = reports.rows.map(report => {
      if (report.status === 'waiting') {
        return { ...report, status: 'Aguardando' }
      } else if (report.status === 'assigned') {
        return { ...report, status: 'Laudando' };
      } else if (report.status === 'not found') {
        return { ...report, status: 'Não Encontrado' };  
      } else if (report.status === 'finish') {
        return { ...report, status: 'Finalizado' };
      } else if (report.status === 'canceled') {
        return { ...report, status: 'Cancelado' }
      } else if (report.status === 'archived') {
        return { ...report, status: 'Arquivado' }        
      } else {
        return { ...report, status: 'Não Definido' }
      }
    });
  
    return processedReports;
  }

  public async create({ auth, request }: HttpContextContract) {

    const userId = auth?.user?.id

    const body = request.only([
      'specie_id',
      'specie_name',
      'pet_id',
      'region_id',
      'history',
      'suspicion',
      'clinic',
      'exam_name',
      'exam_price',
      'exam_image',
      'plantao',
      'urgent',
      'status',
      'exam_reference',
      'exam_old',
      'report_exist'
    ])

    await ReportControl.create({
      specie_id: body.specie_id,
      specie_name: body.specie_name,
      pet_id: body.pet_id,
      region_id: body.region_id,
      history: body.history,
      suspicion: body.suspicion,
      clinic: body.clinic,
      exam_name: body.exam_name,
      exam_price: body.exam_price,
      exam_image: body.exam_image,
      plantao: body.plantao,
      urgent: body.urgent,
      status: body.status,
      reference_report: 0,
      user_id: userId,
      veterinary_id: 0,
      exam_reference: body.exam_reference,
      exam_old: body.exam_old,
      report_exist: body.report_exist
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const laudoId = request.param('id')
    const laudo = await ReportControl.find(laudoId)

    return laudo
  }

  public async update({ request }: HttpContextContract) {
    const laudoId = request.param('id')
    const body = request.only([
      'status'
    ])
    const laudo = await ReportControl.findOrFail(laudoId)
    await laudo.merge(body).save()

    return laudo
  }

  public async destroy({ request }: HttpContextContract) {
    const laudoId = request.param('id')
    const laudo = await ReportControl.findOrFail(laudoId)
    await laudo.delete()

    return true
  }

  public async getReportPdf({ request, response }: HttpContextContract) {
    
    const examId = request.param('id');

    const apiReport = axios.create({
      baseURL: process.env.REPORT_URL || 'http://127.0.0.1:3333',
    });
    const tkn = process.env.PDF_REQUEST_ACCESS_TOKEN;
  
    try {

      // find report
      const reports = await Database.connection('cedimtech').rawQuery(`
        SELECT id 
        FROM report_report 
        WHERE exam_id = ${examId!} 
        ORDER BY id DESC`
      )

      const res = await apiReport.get(`${reports.rows[0].id}/pdf`, {
        headers: {
          'Authorization': `access_token ${tkn}`,
        },
        responseType: 'arraybuffer',
      })
  
      if (res.status === 200) {
        response.header('Content-Type', 'application/pdf');
        response.header('Content-Disposition', `inline; filename=${examId}.pdf`);
        response.send(Buffer.from(res.data, 'binary'))

      } else {
        response.status(res.status).send({ error: 'Erro na geração do PDF' });
      }

    } catch (error) {
      response.status(500).send({ error: 'Erro na solicitação para gerar o PDF' })
    }
  }
}
