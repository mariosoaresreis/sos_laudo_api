import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class exam_exam extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'exam_exam'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public age: number

  @column()
  public age_type: string // D, M, Y

  @column()
  public gender: string // M, F

  @column()
  public historic: string

  @column()
  public suspicion: string

  @column()
  public state: string // CREATE = '1', SENT = '2', ASSIGNED = '3', FINISHED = '4', ARCHIVED = '5'

  @column()
  public breed_id: number

  @column()
  public requester_id: number | null

  @column()
  public specie_id: number

  @column()
  public submitter_id: number

  @column()
  public sedated: boolean

  @column()
  public require_report: boolean

  @column()
  public age_month: number

  @column()
  public customer_id: number

  @column()
  public veterinary_id: number | null

  @column()
  public clinic_id: number | null

  @column()
  public linked_exam: number

  @column()
  public emergency: boolean

  @column()
  public unit_id: number

  @column()
  public selected_body_parts: number[]

  @column()
  public state_update: DateTime

}