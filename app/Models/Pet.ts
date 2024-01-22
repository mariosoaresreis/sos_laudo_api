import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'

export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public birth: Date

  @column()
  public gender: string

  @column()
  public species_id: number

  @column()
  public breed_id: number

  @column()
  public owner_id: number

  @column()
  public image: string

  @beforeSave()
  public static async validateGender(pet: Pet) {
    const gender = String(pet.gender).toUpperCase()

    if (!['M', 'F'].includes(gender)) {
      pet.gender = 'M'
    } else {
      pet.gender = gender
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
