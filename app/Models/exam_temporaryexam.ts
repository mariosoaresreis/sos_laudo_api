import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class exam_temporaryexam extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'exam_temporaryexam'

  @column({ isPrimary: true })
  public study: string

  @column()
  public submitter_id: number

  @column()
  public patient_name: string

  @column()
  public accession_number: string

  @column()
  public study_description: string

  @column.dateTime()
  public study_datetime: String

  @column()
  public veterinary_name: string

  @column()
  public finished: boolean

}