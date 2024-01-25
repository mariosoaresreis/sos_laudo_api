import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { decryptData } from 'App/utils/crypto';
import axios from 'axios';
import { sendEmailPayment } from './EmailController';

export default class PagBankOrderController {

  public async index({}: HttpContextContract) {
      const url = process.env.SAND_BOX_BOLETO_URL
      const token = process.env.TKN_SANDBOX

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'accept': 'application/json',
          'Content-Type': 'application/json'
        },
      };

      const response = await axios.post(
        `${url}`,
        {
            
                reference_id: 'Compra de 1 Crédito(s) - Administrador',
                customer: {
                  name: 'Jose da Silva',
                  email: 'adm@email.com',
                  tax_id: '12345678909'
                },      
               shipping: {
                          address: {
                          country: 'BRA',
                          region: '-',
                          region_code: 'SP',
                            city: '-',
                            postal_code: '00000000',
                            street: 'Produto Digital',
                            number: '-',
                            locality: '-'
                          }
                },
                 items: [
                  {
                      reference_id: 'referencia do item',
                      name: 'nome do item',
                      quantity: 1,
                      unit_amount: 500
                  }
                  ],
                  notification_urls: [
                      "https://meusite.com/notificacoes"
                   ]
      },
        options,
      );
    
      return response.data
  }

  public async create({ request, auth }: HttpContextContract) {

    try{

      const body = request.only(['data'])
      let decriptData = await decryptData(body.data)
      decriptData = JSON.parse(decriptData)

      const userName = auth?.user?.name
      const userEmail = auth?.user?.email

      const url = process.env.SAND_BOX_PAYMENT_PAGBANK_URL
      const token = process.env.TKN_SANDBOX

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      };
    
      const response = await axios.post(
        `${url}`,
/*          {
            reference_id: decriptData.reference_id + ' - ' + userName,
            customer: {
              name: decriptData.customer.name,
              email: userEmail,
              tax_id: decriptData.customer.tax_id,
            },
            charges: [
              {
                reference_id: decriptData.reference_id + ' - ' + userName,
                description: decriptData.reference_id,
                amount: {
                  value: decriptData.charges.amount.value,
                  currency: "BRL"
                },
                payment_method: {
                  type: "BOLETO",
                  boleto: {
                    due_date: decriptData.charges.payment_method.boleto.due_date,
                    instruction_lines: {
                      line_1: "Definir mensagem da linha 1",
                      line_2: "Definir mensagem da linha 2",
                    },
                    holder: {
                      name: decriptData.customer.name,
                      tax_id: decriptData.customer.tax_id,
                      email: userEmail,
                      address: {
                        country: "Brasil",
                        region: "-",
                        region_code: "SP",
                        city: "-",
                        postal_code: "00000000",
                        street: "Produto Digital",
                        number: "-",
                        locality: "-"
                      }
                    }
                  }
                }
              }
            ]
          }*/
          {
            
            reference_id: 'Compra de 1 Crédito(s) - Administrador',
            customer: {
              name: 'Jose da Silva',
              email: 'adm@email.com',
              tax_id: '12345678909'
            },      
           shipping: {
                      address: {
                      country: 'BRA',
                      region: '-',
                      region_code: 'SP',
                        city: '-',
                        postal_code: '00000000',
                        street: 'Produto Digital',
                        number: '-',
                        locality: '-'
                      }
            },
             items: [
              {
                  reference_id: 'referencia do item',
                  name: 'nome do item',
                  quantity: 1,
                  unit_amount: 500
              }
              ],
              notification_urls: [
                  "https://meusite.com/notificacoes"
               ]
  }
          ,
        options,
      );

      if ( response.status === 200 ){
        const value = decriptData.charges.amount.value
        const convertedValue = (value / 100).toFixed(2)
        sendEmailPayment(userName!, userEmail!, 'BOLETO', convertedValue)
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
