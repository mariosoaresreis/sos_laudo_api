import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { decryptData } from 'App/utils/crypto';
import axios from 'axios';
import { sendEmailPayment } from './EmailController';

export default class PagBankPaymentController {

  public async index({}: HttpContextContract) {
      const url = process.env.SAND_BOX_PAYMENT_PAGBANK_URL
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
            charges: [
            {
              amount: {
                value: 1100,
                currency: 'BRL'
              },
              payment_method: {
                card: {
                  holder: {
                    name: 'Jose da Silva'
                  },
                  encrypted: 'V++53ir0qvoK/rUSzNjCqP8Hz9ZTa+HohR779n63CV+NvCeYj4J4lQevL4NKN7Di3BxKQGqfQW5cfS7/4rHw4w8URuOV/j/mGau2GXxkKQ6/szJ6BQr//C4e4XgfCHDwcONQhuPDHMdOB1C+4lzyBbsPJUZ/8TUQrxhMMiMFjwGeg62uf7cUqdFjp+Q5dqJXwhLgH3d1EoX+JKStBLqVzF0lW3gHtFOyfvFhuxxBgB0xrzTKfbTqnL5aSYBoGXRFM0gLodMm6knx7bW+syThxyQffnaigCwj2aNohsu+fuXII+3WnlgrHQxaBx3ChRuWKy+loV2L2USiGulp/bPEcg==',
                  //number: '5240082975622454',
                  //exp_month: 3,
                  //exp_year: 2026,
                  //security_code: '123',
                  store: false
                },
                type: 'CREDIT_CARD',
                installments: 1,
                capture: true,
                soft_descriptor: 'nome fatura'
              },
              reference_id: 'ref_pag',
              description: 'descrição da cobrança'
            }
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

      const url = process.env.SAND_BOX_BOLETO_URL
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
        {  
            charges: [
            {
              amount: {
                value: 1100,
                currency: 'BRL'
              },
              payment_method: {
                card: {
                  encrypted: 'V++53ir0qvoK/rUSzNjCqP8Hz9ZTa+HohR779n63CV+NvCeYj4J4lQevL4NKN7Di3BxKQGqfQW5cfS7/4rHw4w8URuOV/j/mGau2GXxkKQ6/szJ6BQr//C4e4XgfCHDwcONQhuPDHMdOB1C+4lzyBbsPJUZ/8TUQrxhMMiMFjwGeg62uf7cUqdFjp+Q5dqJXwhLgH3d1EoX+JKStBLqVzF0lW3gHtFOyfvFhuxxBgB0xrzTKfbTqnL5aSYBoGXRFM0gLodMm6knx7bW+syThxyQffnaigCwj2aNohsu+fuXII+3WnlgrHQxaBx3ChRuWKy+loV2L2USiGulp/bPEcg==',
                  store: false
                },
                type: 'CREDIT_CARD',
                installments: 1,
                capture: true,
                soft_descriptor: 'nome fatura'
              },
              reference_id: 'ref_pag',
              description: 'descrição da cobrança'
            }
          ]
        },
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
