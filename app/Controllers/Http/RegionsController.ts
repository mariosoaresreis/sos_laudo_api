import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Region from 'App/Models/Region'

export default class RegionsController {
  public async index({}: HttpContextContract) {
    const regioes = await Database.rawQuery('SELECT r.*, g.name as group_name, r.body_id, s.id as species_id, s.name as species_name, r.img_section_list FROM regions r, groups g, species s WHERE r.group_id = g.id AND s.id = g.species_id')
    // const regioes = await Region.all()
    return regioes.rows
  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['name', 'image_count', 'price', 'description', 'display_image', 'emergency_description', 'urgency_description', 'has_direction', 'price_increase', 'group_id', 'section_list', 'img_section_list', 'body_id'])

    await Region.create({
      name: body.name,
      image_count: body.image_count,
      price: body.price,
      description: body.description,
      display_image: body.display_image,
      emergency_description: body.emergency_description,
      urgency_description: body.urgency_description,
      has_direction: body.has_direction,
      price_increase: body.price_increase,
      group_id: body.group_id,
      section_list: JSON.stringify(body.section_list),
      img_section_list: JSON.stringify(body.img_section_list),
      body_id: body.body_id
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const regiaoId = request.param('id')
    const regiao = await Database.rawQuery('SELECT r.*, g.name as group_name, s.id as species_id, s.name as species_name FROM regions r, groups g, species s WHERE r.id = ? AND r.group_id = g.id AND s.id = g.species_id', [regiaoId])

    return regiao.rows[0]
  }

  public async update({ request }: HttpContextContract) {
    const regiaoId = request.param('id')
    const body = request.only(['name', 'image_count', 'price', 'description', 'display_image', 'emergency_description', 'urgency_description', 'has_direction', 'price_increase', 'group_id', 'section_list', 'img_section_list', 'body_id'])

    const regiao = await Region.findOrFail(regiaoId)
    regiao.name = body.name,
    regiao.image_count = body.image_count,
    regiao.price = body.price,
    regiao.description = body.description,
    regiao.display_image = body.display_image,
    regiao.emergency_description = body.emergency_description,
    regiao.urgency_description = body.urgency_description,
    regiao.has_direction = body.has_direction,
    regiao.price_increase = body.price_increase,
    regiao.group_id = body.group_id,
    regiao.section_list = JSON.stringify(body.section_list),
    regiao.img_section_list = JSON.stringify(body.img_section_list),
    regiao.body_id = body.body_id
    await regiao.save()

    return regiao
  }

  public async destroy({ request }: HttpContextContract) {
    const regiaoId = request.param('id')
    const regiao = await Region.findOrFail(regiaoId)
    await regiao.delete()

    return true
  }
}