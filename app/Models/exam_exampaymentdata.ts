import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class exam_exampaymentdata extends BaseModel {

  public static connection = 'cedimtech'
  public static table = 'exam_exampaymentdata'

  @column()
  public auto_price: number

  @column()
  public price: number

  @column()
  public discount: number

  @column()
  public discount_reason: string

  @column()
  public nearby_city: string

  @column()
  public nearby_city_cost: number

  @column()
  public sunday_or_holiday: boolean

  @column()
  public on_duty: boolean

  @column()
  public duty_tax: number

  @column()
  public duty_period: string

  @column()
  public duty_trx: number

  @column()
  public exam_id: number

  @column()
  public money_payment: boolean

}