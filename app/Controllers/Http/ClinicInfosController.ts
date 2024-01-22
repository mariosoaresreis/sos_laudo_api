import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClinicInfo from 'App/Models/ClinicInfo'

export default class ClinicInfosController {
  public async index({}: HttpContextContract) {
    const infos = await ClinicInfo.all()
    return infos
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['name', 'cidade', 'rua', 'bairro', 'cep', 'nro', 'complemento'])

    await ClinicInfo.create({
      name: body.name,
      cidade: body.cidade,
      rua: body.rua,
      bairro: body.bairro,
      cep: body.cep,
      nro: body.nro,
      complemento: body.complemento
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const clinicId = request.param('id')
    const clinicInfo = await ClinicInfo.find(clinicId)

    return clinicInfo
  }

  public async update({ request }: HttpContextContract) {
    const clinicId = request.param('id')
    const body = request.only(['name', 'cidade', 'rua', 'bairro', 'cep', 'nro', 'complemento'])
    const clinicInfo = await ClinicInfo.findOrFail(clinicId)

    await clinicInfo.merge(body).save()

    return clinicInfo
  }

  public async destroy({ request }: HttpContextContract) {
    const clinicId = request.param('id')
    const clinicInfo = await ClinicInfo.findOrFail(clinicId)

    await clinicInfo.delete()

    return true
  }
}
