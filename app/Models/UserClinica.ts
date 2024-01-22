import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserClinica extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public country: string

  @column()
  public clinic: string

  @column()
  public cnpj: string
  
  @column()
  public representant: string

  @column()
  public representant_cpf: string

  @column()
  public crmv_state: string

  @column()
  public crmv_number: string
  
  @column()
  public header: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
