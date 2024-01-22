import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ReportControl extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public specie_id: number

  @column()
  public specie_name: string

  @column()
  public pet_id: number

  @column()
  public region_id: number

  @column()
  public history: string

  @column()
  public suspicion: string

  @column()
  public clinic: string

  @column()
  public exam_name: string

  @column()
  public exam_price: number

  @column()
  public exam_image: string

  @column()
  public plantao: string

  @column()
  public urgent: string

  @column()
  public status: string

  @column()
  public reference_report: number

  @column()
  public user_id: number

  @column()
  public veterinary_id: number

  @column()
  public exam_reference: number

  @column()
  public exam_old: number

  @column()
  public report_exist: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
