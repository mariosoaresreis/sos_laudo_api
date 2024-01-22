import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { decryptData } from 'App/utils/crypto';
import axios from 'axios';
import { sendEmailPayment } from './EmailController';

export default class PaymentPixController {

  public async index({ }: HttpContextContract) {

      // const userId = auth?.user?.id

      try{
        const url = process.env.SAND_BOX_QR_URL
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
            customer: {
              name: "Jose da Silva",
              email: "email@test.com",
              tax_id: "12345678909",
            },
            items: [
              {
                reference_id: "referencia do item",
                name: "nome do item",
                quantity: 1,
                unit_amount: 500
              }
            ],
            qr_codes: [
              {
                amount: {
                  value: 500
                },
              }
            ],
          },
          options,
        );
  
        return {
          status: 200,
          response: response.data.qr_codes[0].links
        }
      }catch(error) {
        return{
          status: 400,
          error: error
        }
      }
  }

  public async create({ request, auth }: HttpContextContract) {

    try{

      const body = request.only(['data'])
      let decriptData = await decryptData(body.data)
      decriptData = JSON.parse(decriptData)

      const userName = auth?.user?.name
      const userEmail = auth?.user?.email

      const url = process.env.SAND_BOX_QR_URL
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
          reference_id: decriptData.reference_id + ' - ' + userName,
          customer: {
            name: userName,
            email: userEmail,
            tax_id: decriptData.customer.tax_id,
          },
          items: [
            {
              reference_id: decriptData.items.reference_id,
              name: decriptData.items.name,
              quantity: decriptData.items.quantity,
              unit_amount: decriptData.items.unit_amount
            }
          ],
          qr_codes: [
            {
              amount: {
                value: decriptData.qr_codes.amount.value
              },
            }
          ],
        },
        options,
      );

      if ( response.status === 200 || response.status === 201 ){
        const value = decriptData.qr_codes.amount.value
        const convertedValue = (value / 100).toFixed(2)
        sendEmailPayment(userName!, userEmail!, 'PIX', convertedValue)
      }
  
      return {
        status: 200,
        response: response.data
      } 
    }catch(error){
      return {
        status: 403,
        error: error
      } 
    }
  }
}
