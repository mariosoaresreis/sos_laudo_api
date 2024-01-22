import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Specie from 'App/Models/Specie'

export default class SpeciesController {
  public async index({}: HttpContextContract) {
    const especies = await Specie.all();
    return especies
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['name', 'image', 'pos', 'enabled'])

    await Specie.create({
      name: body.name,
      pos: body.pos,
      image: body.image,
      enabled: body.enabled
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const especieId = request.param('id')
    const especie = await Specie.find(especieId)
    return especie
  }

  public async update({ request }: HttpContextContract) {
    const especieId = request.param('id')
    const body = request.only(['name', 'image', 'pos', 'enabled'])
    const especie = await Specie.findOrFail(especieId)
    await especie.merge(body).save()

    return especie
  }

  public async destroy({ request }: HttpContextContract) {
    const especieId = request.param('id')
    const especie = await Specie.findOrFail(especieId)
    await especie.delete()

    return true
  }

  public async getGroups({ request }: HttpContextContract) {
    const especieId = request.param('id')
    const especie = await Specie.findOrFail(especieId)

    let groups = await Database.query().from('groups').select('*').where('species_id', especieId).exec()
    groups = await Promise.all(groups.map(async (group) => {
    let regions = await Database.query().from('regions').select('*').where('group_id', group.id).exec()

      regions = regions.map((region) => {
        return {
          id: region.id,
          name: region.name,
          price: region.price,
          display_image: region.display_image,
          body_id: region.body_id,
          img_section_list: region.img_section_list
        }
      })

      return {
        id: group.id,
        name: group.name,
        regions
      }
    }))

    return {
      name: especie.name,
      image: especie.image,
      groups: groups
    }

    return groups
  }
}
