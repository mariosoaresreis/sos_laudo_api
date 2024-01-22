import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import axios from 'axios';

export default class PaymentCheckController {

  public async index({auth}: HttpContextContract) {

    const userId = auth.user?.id
    const pendingPayment = await Database.rawQuery(`SELECT id, buy_reference FROM credits WHERE user_id = ? AND status = 'A' AND buy_type = 'B'`, [userId!])

    if ( pendingPayment.rows ){

      for (const i of pendingPayment.rows){
        
        const id = i.id
        const itemPayment = i.buy_reference

        const url = process.env.SAND_BOX_VALIDATE_PAYMENT
        const token = process.env.TKN_SANDBOX
    
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        };
        
        const response = await axios.get(
          `${url}` + `${itemPayment}`,
          options,
        );
          
        if  ( response.data.status === 'PAID' ){
          const queryUpdate = await Database.rawQuery(`UPDATE credits set status = 'C' WHERE id = ${id}`)
        }else if  ( response.data.status === 'CANCELED' ){
          const queryUpdate = await Database.rawQuery(`UPDATE credits set status = 'X' WHERE id = ${id}`)
        }else{
          console.log('WAIT')
        }

      }

      return { status: 200 }

    }

  }
}

