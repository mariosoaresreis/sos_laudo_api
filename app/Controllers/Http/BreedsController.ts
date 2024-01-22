import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Breed from 'App/Models/Breed';

export default class BreedsController {
  public async index({}: HttpContextContract) {
    // const breeds = await Breed.all();

    const breeds = await Database.rawQuery(`
      SELECT b.id, b.name, b.specie_id, b.available, s.name as specie_name 
      FROM breeds b, species s
      WHERE s.id = b.specie_id
      `)
    return breeds.rows

  }

  public async create({ request }: HttpContextContract) {
    const body = request.only(['name', 'specie_id'])

    await Breed.create({
      name: body.name,
      specie_id: body.specie_id,
      available: true
    })

    return { status: 200 }
  }

  public async show({ request }: HttpContextContract) {
    const breedId = request.param('id')
    const breed = await Breed.find(breedId)
    return breed
  }

  public async update({ request }: HttpContextContract) {
    const breedId = request.param('id')
    const body = request.only(['name', 'specie_id'])
    const breed = await Breed.findOrFail(breedId)
    await breed.merge(body).save()

    return breed
  }

  public async destroy({ request }: HttpContextContract) {
    const breedId = request.param('id')
    const breed = await Breed.findOrFail(breedId)
    await breed.delete()

    return true
  }
}
