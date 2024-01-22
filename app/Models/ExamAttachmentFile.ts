import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ExamAttachmentFileControl extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public exam_id: number

  @column()
  public file: string

  @column()
  public type_file: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
