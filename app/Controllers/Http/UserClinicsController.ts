import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserClinic from 'App/Models/UserClinic'

export default class UserClinicsController {
  public async index({}: HttpContextContract) {
    const userClinics = await UserClinic.all()
    return userClinics
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['user_id', 'clinic_id'])

    await UserClinic.create({
      user_id: body.user_id,
      clinic_id: body.clinic_id
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const userClinicId = request.param('id')
    const userClinic = await UserClinic.find(userClinicId)

    return userClinic
  }

  public async update({ request }: HttpContextContract) {
    const userClinicId = request.param('id')
    const body = request.only(['user_id', 'clinic_id'])
    const userClinic = await UserClinic.findOrFail(userClinicId)

    await userClinic.merge(body).save()

    return userClinic
  }

  public async destroy({ request }: HttpContextContract) {
    const userClinicId = request.param('id')
    const userClinic = await UserClinic.findOrFail(userClinicId)

    await userClinic.delete()

    return true
  }
}
