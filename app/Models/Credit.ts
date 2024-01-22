import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Credit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public description: string

  @column()
  public plan_value: number

  @column()
  public qtd: number

  @column.dateTime({ autoCreate: true })
  public buy_at: DateTime

  @column()
  public expired_at: string

  @column()
  public status: string

  @column()
  public buy_reference: string

  @column()
  public buy_type: string

  @column()
  public url_boleto: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
