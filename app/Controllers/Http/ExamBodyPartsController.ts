import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import units_exambodypart from 'App/Models/units_exambodypart';

export default class ExamBodyPartsController {

  public async index({ }: HttpContextContract) {

    const bodyParts = await units_exambodypart.all()
    return bodyParts

  }

}
