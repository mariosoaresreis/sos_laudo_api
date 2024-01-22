import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class exam_examstatechanges extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'exam_examstatechanges'

  @column()
  public state: number

  @column.dateTime()
  public time: DateTime

  @column()
  public exam_id: number

}