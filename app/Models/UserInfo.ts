import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserInfo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public category: number

  @column()
  public is_cuidador: boolean

  @column()
  public is_veterinario: boolean

  @column()
  public is_laudador: boolean

  @column()
  public is_examinador_veterinario: boolean

  @column()
  public is_examinador_radiologia: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}