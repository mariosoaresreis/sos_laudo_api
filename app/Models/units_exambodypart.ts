import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class units_exambodypart extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'units_exambodypart'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public available: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
