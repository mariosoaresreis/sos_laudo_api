import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Credit from 'App/Models/Credit';
import { addYears, format } from 'date-fns';

export default class CreditsController {
  public async index({ auth }: HttpContextContract) {

    const userId = auth?.user?.id

    const credits = await Database.rawQuery(`
      SELECT id, description, to_char(plan_value, '999,999.00') as plan_value, qtd, buy_at, expired_at, status, buy_type, url_boleto, TO_CHAR(created_at AT TIME ZONE 'BRT', 'DD/MM/YYYY HH24:MI:SS') as created_at
      FROM credits
      WHERE user_id = ? 
      ORDER BY created_at DESC`, [userId!]
    )

    return credits.rows
  }

  public async create({ request, auth }: HttpContextContract) {
    const body = request.only(['qtd', 'plan_value', 'description', 'status', 'buy_reference', 'buy_type', 'url_boleto'])

    const userId = auth?.user?.id
  
    const currentDate = new Date();
    const nextYear = addYears(currentDate, 1);
    const expired_at = format(nextYear, 'dd/MM/yyyy');

    await Credit.create({
      user_id: userId,
      description: body.description,
      plan_value: body.plan_value,
      qtd: body.qtd,
      expired_at: expired_at,
      status: body.status,
      buy_reference: body.buy_reference,
      buy_type: body.buy_type,
      url_boleto: body.url_boleto
    })
    
    return { status: 200 }
  }

  public async addCredits({ request }: HttpContextContract) {
    const body = request.only(['user_id', 'qtd', 'plan_value', 'description', 'status', 'buy_reference', 'buy_type', 'url_boleto'])
  
    const currentDate = new Date();
    const nextYear = addYears(currentDate, 1);
    const expired_at = format(nextYear, 'dd/MM/yyyy');

    await Credit.create({
      user_id: body.user_id,
      description: body.description,
      plan_value: body.plan_value,
      qtd: body.qtd,
      expired_at: expired_at,
      status: body.status,
      buy_reference: body.buy_reference,
      buy_type: body.buy_type,
      url_boleto: body.url_boleto
    })
    
    return { status: 200 }
  }

  public async update({ request }: HttpContextContract) {
    const creditId = request.param('id')
    const body = request.only(['id', 'status'])
    const credit = await Credit.findOrFail(creditId)
    await credit.merge(body).save()

    return credit
  }

  public async destroy({ request }: HttpContextContract) {
    const creditId = request.param('id')
    const credit = await Credit.findOrFail(creditId)
    await credit.delete()

    return true
  }

}
