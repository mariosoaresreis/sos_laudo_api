import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cms from 'App/Models/Cms';

export default class CmsController {
  public async index({}: HttpContextContract) {
    const cms = await Cms.all();
    return cms
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['reference', 'ordering', 'title', 'content'])

    await Cms.create({
      reference: body.reference,
      ordering: body.ordering,
      title: body.title,
      content: body.content
    })
    
    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const cmsId = request.param('id')
    const cms = await Cms.find(cmsId)
    return cms
  }

  public async update({ request }: HttpContextContract) {
    const cmsId = request.param('id')
    const body = request.only(['reference', 'ordering', 'title', 'content'])
    const cms = await Cms.findOrFail(cmsId)
    await cms.merge(body).save()

    return cms
  }

  public async destroy({ request }: HttpContextContract) {
    const cmsId = request.param('id')
    const cms = await Cms.findOrFail(cmsId)
    await cms.delete()

    return true
  }

}
