import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserEndereco extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public country: string

  @column()
  public cep: string

  @column()
  public street: string

  @column()
  public number: number

  @column()
  public district: string
  
  @column()
  public city: string

  @column()
  public state: string

  @column()
  public complement: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
