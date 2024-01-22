import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class exam_attachmentfile extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'exam_attachmentfile'

  @column({ isPrimary: true })
  public id: number

  @column()
  public file: string

  @column()
  public comment: string

  @column()
  public exam_id: number

}