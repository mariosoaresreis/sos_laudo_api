import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Package from 'App/Models/Package';

export default class PackagesController {
  public async index({}: HttpContextContract) {
    const pack = await Package.all();
    return pack
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['name', 'qtd_credits', 'plan_value'])

    await Package.create({
      name: body.name,
      qtd_credits: body.qtd_credits,
      plan_value: body.plan_value
    })
    
    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const packageId = request.param('id')
    const pack = await Package.find(packageId)
    return pack
  }

  public async update({ request }: HttpContextContract) {
    const packageId = request.param('id')
    const body = request.only(['name', 'qtd_credits', 'plan_value'])
    const pack = await Package.findOrFail(packageId)
    await pack.merge(body).save()

    return pack
  }

  public async destroy({ request }: HttpContextContract) {
    const packageId = request.param('id')
    const pack = await Package.findOrFail(packageId)
    await pack.delete()

    return true
  }

}
