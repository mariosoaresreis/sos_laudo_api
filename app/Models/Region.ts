import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Region extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public image_count: number

  @column()
  public price: number

  @column()
  public description: string

  @column()
  public display_image: string

  @column()
  public emergency_description: string

  @column()
  public urgency_description: string

  @column()
  public has_direction: boolean

  @column()
  public price_increase: number

  @column()
  public group_id: number

  @column()
  public section_list: string

  @column()
  public img_section_list: string

  @column()
  public body_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
