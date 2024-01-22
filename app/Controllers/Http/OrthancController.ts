import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import fetch from 'node-fetch';
import fs from 'fs';

export default class OrthancController {
  public async index({ }: HttpContextContract) {
    try {
      const fileData = fs.readFileSync('/Users/amador/Downloads/CR000000.dcm');

      const url = 'http://54.173.85.170:8042/instances';

      const response = await fetch(url, {
        method: 'POST',
        body: fileData,
        headers: {
          'Authorization': 'Basic YnJpZGdlOmJyaWRnZQ==',
          'Content-Type': 'application/dicom',
        },
      });

      if (response.ok) {
        const responseData = await response.text();
        console.log('Resposta do servidor:', responseData);
        return(responseData)
      } else {
        return (response.statusText)
      }
    } catch (error) {
      return (error)
    }
  }
}
