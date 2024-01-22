import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Pet from 'App/Models/Pet'

export default class PetsController {
  public async index({ request, auth }: HttpContextContract) {
    const userId = auth?.user?.id
    const query = request.qs()

    if (!query.species_id) {
      const pets = await Database.rawQuery('SELECT p.id, p.name, p.birth, p.gender, p.image, p.species_id, p.breed_id, s.name as species_name, p.owner_id, p.created_at, p.updated_at FROM pets p, species s WHERE p.species_id = s.id AND p.owner_id = ?;', [userId!])
      return pets.rows
    } else {
      const pets = await Database.rawQuery(`
        SELECT p.id, p.name, p.birth, p.gender, p.species_id, p.breed_id, p.image, s.name as species_name, p.owner_id, p.created_at, p.updated_at 
        FROM pets p, species s 
        WHERE p.species_id = s.id 
        AND p.owner_id = ? 
        AND p.species_id = ?;`, [userId!, query.species_id]
      )
      return pets.rows
    }
  }

  public async create({ request, auth }: HttpContextContract) {
    const body = request.only(['name', 'birth', 'gender', 'species_id', 'breed_id', 'image', 'owner_id'])

    const userId = auth?.user?.id

    const owner_id = body.owner_id !== '0' && body.owner_id !== null && body.owner_id !== undefined ? body.owner_id : userId
    
    await Pet.create({
      name: body.name,
      birth: body.birth,
      gender: body.gender,
      species_id: body.species_id,
      breed_id: body.breed_id,
      owner_id: owner_id,
      image: body.image
    })

    return { status: 200 }
  }

  public async show({ request, auth }: HttpContextContract) {
    const petId = request.param('id')
    const userId = auth?.user?.id
    const pet = await Pet.find(petId)

    if (pet?.owner_id != userId) return { status: 401 }
    return pet
  }

  public async update({ request, auth }: HttpContextContract) {
    const petId = request.param('id')
    const userId = auth?.user?.id
    const body = request.only(['name', 'birth', 'gender', 'species_id', 'breed_id', 'image'])
    const pet = await Pet.findOrFail(petId)

    if (pet?.owner_id != userId) return { status: 401 }
    await pet.merge(body).save()

    return pet
  }

  public async destroy({ request, auth }: HttpContextContract) {
    const petId = request.param('id')
    const userId = auth?.user?.id
    const pet = await Pet.findOrFail(petId)

    if (pet.owner_id != userId) return { status: 401 }
    await pet.delete()

    return true
  }

  public async listPets({auth}: HttpContextContract) {

    const userId = auth.user?.id
    const isAdmin = auth.user?.is_adm

    if ( isAdmin ){
      const pets = await Database.rawQuery(`
      SELECT p.id, p.name, p.birth, p.gender, p.species_id, p.breed_id, p.image, s.name as species_name, b.name as breed_name, p.owner_id, u.name as owner_name, p.created_at, p.updated_at 
      FROM pets p, species s, users u, breeds b
      WHERE p.species_id = s.id 
      AND b.id = p.breed_id
      AND p.owner_id = u.id`)
      return pets.rows
    }else{
      const pets = await Database.rawQuery(`
        SELECT p.id, p.name, p.birth, p.gender, p.species_id, p.breed_id, p.image, s.name as species_name, b.name as breed_name, p.owner_id, p.created_at, p.updated_at 
        FROM pets p, species s, breeds b
        WHERE p.species_id = s.id 
        AND b.id = p.breed_id
        AND p.owner_id = ${userId}`)
      return pets.rows
    }
  }
}