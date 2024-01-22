import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import ExamAttachmentFileControl from 'App/Models/ExamAttachmentFile';

export default class ExamAttachmentFileController {

  public async index({ request }: HttpContextContract) {

    const examId = request.param('id')

    const examImages = await Database.rawQuery(`
      SELECT id, file, type_file
      FROM exam_attachmentfiles
      WHERE exam_id = ${examId!} 
      ORDER BY file ASC`
    )

    return examImages.rows
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['exam_id', 'file', 'type_file'])

    await ExamAttachmentFileControl.create({
      exam_id: body.exam_id,
      file: body.file,
      type_file: body.type_file
    })
    
    return { status: 200 }
  }

  public async destroy({ request }: HttpContextContract) {
    const fileId = request.param('id')
    const pack = await ExamAttachmentFileControl.findOrFail(fileId)
    await pack.delete()

    return true
  }

}
