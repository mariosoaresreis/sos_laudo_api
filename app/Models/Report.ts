import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Report extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public pet_id: number

  @column()
  public history: string

  @column()
  public report: string

  @column()
  public region_id: number

  @column()
  public image_list: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}