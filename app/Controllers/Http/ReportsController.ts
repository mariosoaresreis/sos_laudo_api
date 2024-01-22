import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Report from 'App/Models/Report'

export default class ReportsController {
  public async index({}: HttpContextContract) {
    const laudos = await Report.all()
    return laudos
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['pet_id', 'history', 'report', 'region_id', 'image_list'])

    await Report.create({
      pet_id: body.pet_id,
      history: body.history,
      report: body.report,
      region_id: body.region_id,
      image_list: JSON.stringify(body.image_list)
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const laudoId = request.param('id')
    const laudo = await Report.find(laudoId)

    return laudo
  }

  public async update({ request }: HttpContextContract) {
    const laudoId = request.param('id')
    const body = request.only(['pet_id', 'history', 'report', 'region_id', 'image_list'])
    const laudo = await Report.findOrFail(laudoId)
    await laudo.merge(body).save()

    return laudo
  }

  public async destroy({ request }: HttpContextContract) {
    const laudoId = request.param('id')
    const laudo = await Report.findOrFail(laudoId)
    await laudo.delete()

    return true
  }
}
