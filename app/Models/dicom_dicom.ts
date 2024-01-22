//import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class dicom_dicom extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'dicom_dicom'

  @column({ isPrimary: true })
  public instance: string

  @column()
  public exam_id: number | null

  @column()
  public temporary_exam_id: string

}