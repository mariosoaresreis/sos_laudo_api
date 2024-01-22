import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Group from 'App/Models/Group'

export default class GroupsController {
  public async index({}: HttpContextContract) {
    const grupos = await Database.rawQuery('SELECT g.id, g.name, g.species_id, s.name as species_name, g.created_at, g.updated_at FROM groups g, species s WHERE g.species_id = s.id')
    // const grupos = await Group.all()
    return grupos.rows
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['name', 'species_id'])

    await Group.create({
      name: body.name,
      species_id: body.species_id
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const grupoId = request.param('id')
    const grupo = await Group.find(grupoId)
    return grupo
  }

  public async update({ request }: HttpContextContract) {
    const grupoId = request.param('id')
    const body = request.only(['name', 'species_id'])
    const grupo = await Group.findOrFail(grupoId)
    await grupo.merge(body).save()

    return grupo
  }

  public async destroy({ request }: HttpContextContract) {
    const grupoId = request.param('id')
    const grupo = await Group.findOrFail(grupoId)
    await grupo.delete()

    return true
  }
}
