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

  public async pagSeguroPublicKey(){
    try{
      const response = await axios({
          method: 'POST',
          url: 'https://sandbox.api.pagseguro.com/public-keys',
          headers: {
              accept: 'application/json',
              Autorization: `Bearer ${process.env.TKN_SANDBOX}` ,
              'content-type': 'application/json'
          },
          data: {
              type: 'card'
          }
      })
      if (response.status === 201) {
        console.log(response)
        return response
      } else {
          console.log(response)
          return response.status
      }

    }
    catch (error){
        console.error('Erro ao obter chave pública do PagSeguro', error)
      return error
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
      const responsePedido = await axios.post(
        `${url}`,
        {
          "reference_id": decriptData.reference_id,
          "customer":{
            "name": decriptData.name,
            "email": decriptData.email,
            "tax_id": decriptData.cpfCnpj,
          },
          "items":[{
            "reference_id": decriptData.reference_id,
            "name": decriptData.reference_id,
            "quantity": 1,
            "unity_amount":decriptData.value
          }
          ],
          "shipping":{
            "address":{
              "street": "",
              "number": "",
              "complement": "",
              "locality": "",
              "city": "",
              "region_code": "",
              "country": "BRA",
              "postal_code": ""
            },
            "notification_urls": [
              ""
            ],
            "charges":[
              {
                "reference_id": decriptData.reference_id,
                "description": decriptData.reference_id,
                "amount":{
                  "value": decriptData.value,
                  "currency": "BRL"
                },
                "payment_method":{
                    "type": "CREDIT_CARD",
                    "installments": 1,
                    "capture": true,
                    "card": "", // encryptedcard 
                    "store": false
                }
              }
            ]
          }


        }
      )

      if ( responsePedido.status === 200 || responsePedido.status === 201 ){
        const value = decriptData.amount.value
        const convertedValue = (value / 100).toFixed(2)
        sendEmailPayment(userName!, auth?.user?.email!, 'CARTÃO DE CRÉDITO', convertedValue)
      }
  
      return {
        status: 200,
        response: responsePedido.data
      } 
    }catch(error){
      return {
        status: 403
      } 
    }
  }
}
