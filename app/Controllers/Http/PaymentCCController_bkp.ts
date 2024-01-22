import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { decryptData } from 'App/utils/crypto';
import axios from 'axios';
import { sendEmailPayment } from './EmailController';


export default class PaymentCCController {
  public async index({}: HttpContextContract) {

    // const userId = auth?.user?.id


    const url = process.env.SAND_BOX_URL
    const token = process.env.TKN_SANDBOX

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    
    const response = await axios.post(
      `${url}`,
      {
        reference_id: "ex-00001",
        description: "Motivo do pagamento",
        amount: {
          value: 4000,
          currency: "BRL"
        },
        payment_method: {
          type: "CREDIT_CARD",
          installments: 1,
          capture: true,
          card: {
            number: "372938001199778",
            exp_month: "03",
            exp_year: "2026",
            security_code: "1234",
            holder: {
              name: "Jose da Silva"
            }
          }
        }
      },
      options,
    );

    return {
      response: response.data
    }
  }

  public async create({ request, auth }: HttpContextContract) {
    const body = request.only(['data'])
    let decriptData = await decryptData(body.data)
    decriptData = JSON.parse(decriptData)

    const userName = auth?.user?.name

    const url = process.env.SAND_BOX_URL
    const token = process.env.TKN_SANDBOX

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    
    try{
      const response = await axios.post(
        `${url}`,
        {
          reference_id: decriptData.reference_id + ' - ' + userName,
          description: decriptData.description,
          amount: {
            value: decriptData.amount.value,
            currency: decriptData.amount.currency
          },
          payment_method: {
            type: decriptData.payment_method.type,
            installments: decriptData.payment_method.installments,
            capture: decriptData.payment_method.capture,
            card: {
              number: decriptData.payment_method.card.number,
              exp_month: decriptData.payment_method.card.exp_month,
              exp_year: decriptData.payment_method.card.exp_year,
              security_code: decriptData.payment_method.card.security_code,
              holder: {
                name: decriptData.payment_method.holder.name
              }
            }
          }
        },
        options,
      );

      if ( response.status === 200 || response.status === 201 ){
        const value = decriptData.amount.value
        const convertedValue = (value / 100).toFixed(2)
        sendEmailPayment(userName!, auth?.user?.email!, 'CARTÃO DE CRÉDITO', convertedValue)
      }
  
      return {
        status: 200,
        response: response.data
      } 
    }catch(error){
      return {
        status: 403
      } 
    }
  }
}
