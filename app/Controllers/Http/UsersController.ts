import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import UserClinica from 'App/Models/UserClinica'
import UserContato from 'App/Models/UserContato'
import UserEndereco from 'App/Models/UserEndereco'
import UserExaminadorRad from 'App/Models/UserExaminadorRad'
import UserExaminadorVet from 'App/Models/UserExaminadorVet'
import UserIdentificacao from 'App/Models/UserIdentificacao'
import UserInfo from 'App/Models/UserInfo'
import UserLaudador from 'App/Models/UserLaudador'
import UserVeterinario from 'App/Models/UserVeterinario'
import UserVeterinarioClinica from 'App/Models/UserVeterinarioClinica'
import { sendResetPassword } from './EmailController'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const users = await Database.rawQuery('SELECT u.id, u.name, u.is_adm, u.email, u.active, i.category, i.is_cuidador, i.is_veterinario, i.is_laudador, i.is_examinador_veterinario, i.is_examinador_radiologia, u.created_at, u.updated_at FROM users u, user_infos i WHERE i.user_id = u.id')
    // const users = await User.all()
    return users.rows
  }

  public async store({ request }: HttpContextContract) {

    const body = request.only(['name', 'email', 'password', 'category', 'isCuidador', 'isVeterinario', 'isLaudador', 'isExaminadorVeterinario', 'isExaminadorRadiologia', 'is_adm'])

    // verifica se o email esta cadastrado
    const verifyEmail = await User.findBy('email', body.email)

    if ( verifyEmail === null ){
      
      const isDonoDePet = 
        !body.isCuidador && !body.isVeterinario && !body.isLaudador && 
        !body.isExaminadorVeterinario && !body.isExaminadorRadiologia            

      const user = await User.create({
        name: body.name,
        email: body.email,
        password: body.password,
        active: isDonoDePet,
        is_adm: body.is_adm
      })    
  
      // inclui os dados base do usuario
      await UserInfo.create({
        user_id: user.id,
        category: body.category,
        is_cuidador: body.isCuidador,
        is_veterinario: body.isVeterinario,
        is_laudador: body.isLaudador,
        is_examinador_veterinario: body.isExaminadorVeterinario,
        is_examinador_radiologia: body.isExaminadorRadiologia,
      })

      return { status: 200 }

    }else{

      return { status: 500 }
      
    }

  }

  public async updatepass({ auth, request } : HttpContextContract){
    try {
      const userId = auth?.user?.id
    const body = request.only(['password','newPassword'])
    const token = await auth.use('api')
    .attempt(auth.user?.email!, body.password)
    if (token !== null){
      const user = await User.findOrFail(userId)
      const nUser = user
      nUser.password = body.newPassword
      await user.merge(nUser).save()
      return { status: 200 }
    } else {
      return { status: 403 } 
    }
    } catch{
      return { status: 500}
    }
  }

  public async resetPass({ request } : HttpContextContract){
    try {
    const body = request.only(['email'])
    const res = await sendResetPassword(body.email)
    if(res === 200){
      return {status: 200}
    } else {
      return {status: 403}
    }
    } catch{
      return { status: 500}
    }
  }

  public async show({ request }: HttpContextContract) {
    const userId = request.param('id')
    const user = await User.find(userId)
    return user
  }

  public async update({ request }: HttpContextContract) {
    const userId = request.param('id')
    const body = request.only(['name', 'email', 'password', 'active', 'is_adm'])
    const user = await User.findOrFail(userId)
    await user.merge(body).save()

    return { status: 200 }
  }

  public async destroy({ request }: HttpContextContract) {
    const userId = request.param('id')
    const user = await User.findOrFail(userId)
    await user.delete()

    return true
  }

  public async howiam({ auth }: HttpContextContract) {
    const userId = auth.user!.id

    const userInfo = await Database.query().from("users")
      .join('user_infos', 'users.id', '=', 'user_infos.user_id')
      .select(['users.name', 'users.email', 'user_infos.category'])
      .where('users.id', userId)
      .firstOrFail()

    return userInfo
  }

  public async activate({ request }: HttpContextContract) {
    const userId = request.param('id')

    const user = await User.findOrFail(userId)
    user.active = true
    user.save()

    return user
  }

  public async identificacao({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(["name", 'document_type', 'document_number'])
    
    const user = await User.findOrFail(userId)
    await user.merge({name: body.name}).save()

    const duplicatedCPF = await UserIdentificacao.findBy("document_number" , body.document_number)

    if (duplicatedCPF !== null && duplicatedCPF?.user_id !== userId){
      return { status : 403}
    }
    const identificacao = await UserIdentificacao.updateOrCreate({user_id: userId}, {
      user_id: userId,
      document_type: body.document_type,
      document_number: body.document_number    
      })
      return identificacao;
  }

  public async contato({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['email', 'whatsapp', 'phone', 'phone_emergency'])

    const contato = await UserContato.updateOrCreate({user_id: userId}, {
      user_id: userId,
      email: body.email,
      whatsapp: body.whatsapp,
      phone: body.phone,
      phone_emergency: body.phone_emergency
    })

    return contato;
  }

  public async endereco({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['country', 'cep', 'street', 'number', 'district', 'city', 'state', 'complement'])

    const endereco = await UserEndereco.updateOrCreate({user_id: userId}, {
      user_id: userId,
      country: body.country,
      cep: body.cep, 
      street: body.street,
      number: body.number,
      district: body.district,
      city: body.city,
      state: body.state,
      complement: body.complement
    })

    return endereco;
  }

  public async clinica({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['country', 'clinic', 'cnpj', 'representant', 'representant_cpf', 'crmv_state', 'crmv_number', 'header'])

    const clinica = await UserClinica.updateOrCreate({user_id: userId}, {
      user_id: userId,
      country: body.country,
      clinic: body.clinic, 
      cnpj: body.cnpj,
      representant: body.representant,
      representant_cpf: body.representant_cpf,
      crmv_state: body.crmv_state,
      crmv_number: body.crmv_number,
      header: body.header
    })

    return clinica;
  }

  public async examinadorVet({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['country', 'crmv_state', 'crmv_number', 'signature'])

    const examinadorVet = await UserExaminadorVet.updateOrCreate({user_id: userId}, {
      user_id: userId,
      country: body.country,
      crmv_state: body.crmv_state,
      crmv_number: body.crmv_number,
      signature: body.signature
    })

    return examinadorVet;
  }

  public async examinadorRad({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['country', 'crtr_state', 'crtr_number', 'signature'])

    const examinadorRad = await UserExaminadorRad.updateOrCreate({user_id: userId}, {
      user_id: userId,
      country: body.country,
      crtr_state: body.crtr_state,
      crtr_number: body.crtr_number,
      signature: body.signature
    })

    return examinadorRad;
  }

  public async laudador({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['country', 'crtr_state', 'crtr_number', 'signature', 'curriculum', 'specialist_title'])

    const laudador = await UserLaudador.updateOrCreate({user_id: userId}, {
      user_id: userId,
      country: body.country,
      crtr_state: body.crtr_state,
      crtr_number: body.crtr_number,
      signature: body.signature,
      curriculum: body.curriculum,
      specialist_title: body.specialist_title
    })

    return laudador;
  }

  public async veterinario({ auth, request }: HttpContextContract) {
    const userId = auth.user!.id

    const body = request.only(['country', 'autonomous', 'crmv_state', 'crmv_number', 'signature', 'clinicas'])

    const veterinario = await UserVeterinario.updateOrCreate({user_id: userId}, {
      user_id: userId,
      country: body.country,
      crmv_state: body.crmv_state,
      crmv_number: body.crmv_number,
      signature: body.signature,
      autonomous: body.autonomous
    })

    await Database.query().from("user_veterinario_clinicas").where("veterinario_id", veterinario.id).delete()

    const clinicasWithId = body.clinicas.map(clinica => ({
      veterinario_id: veterinario.id,
      name: clinica
    }))

    await UserVeterinarioClinica.createMany(clinicasWithId)

    return veterinario;
  }

  public async complemento({ auth }: HttpContextContract) {

    const userId = auth.user!.id

    const info = await UserInfo.findBy("user_id", userId)
    const identificacao = await UserIdentificacao.findBy("user_id", userId)
    const contato = await UserContato.findBy("user_id", userId)
    const endereco = await UserEndereco.findBy("user_id", userId)
    const clinica = await UserClinica.findBy("user_id", userId)
    const laudador = await UserLaudador.findBy("user_id", userId)
    const examinadorVet = await UserExaminadorVet.findBy("user_id", userId)
    const examinadorRad = await UserExaminadorRad.findBy("user_id", userId)
    const veterinario = await UserVeterinario.findBy("user_id", userId)

    const clinicas = veterinario ? 
        await Database.query().from("user_veterinario_clinicas")
          .select('name')
          .where('veterinario_id', veterinario.id).exec()
      : []

    const userName = await Database.query().from("users")
      .select('name')
      .where('id', userId).first()    

    const data = {
      name: userName.name,
      info,
      identificacao,
      contato,
      endereco,
      clinica,
      laudador,
      examinadorVet,
      examinadorRad,
      veterinario: {
        info: veterinario,
        clinicas
      }
    }

    return data
  }

  public async isRegistered({ auth }: HttpContextContract) {
    const userId = auth.user!.id

    const identificacao = await UserIdentificacao.findBy("user_id", userId)
    if (!identificacao?.document_number || !identificacao?.document_type) return false
    
    const contato = await UserContato.findBy("user_id", userId)
    if (!contato?.whatsapp) return false

    const endereco = await UserEndereco.findBy("user_id", userId)
    if (!endereco?.country || !endereco?.cep || !endereco?.street || !endereco?.number || !endereco?.district || !endereco?.city || !endereco?.state) return false

    const info = await UserInfo.findBy("user_id", userId)
    if (info?.category == 2) {

      const clinica = await UserClinica.findBy("user_id", userId)
      if (!clinica?.clinic || !clinica?.cnpj || 
          !clinica?.crmv_state || !clinica?.crmv_number || 
          !clinica?.country) {
            
            return false
      }
    }

    if (info?.is_laudador) {
      const laudador = await UserLaudador.findBy("user_id", userId)

      if (!laudador?.signature || !laudador?.curriculum || !laudador?.country || !laudador?.crtr_state || !laudador?.crtr_number) return false
    }

    if (info?.is_veterinario) {
      const veterinario = await UserVeterinario.findBy("user_id", userId)

      if (!veterinario?.signature || !veterinario?.country || !veterinario?.crmv_state || !veterinario?.crmv_number) return false
    }

    if (info?.is_examinador_veterinario) {
      const examinadorVet = await UserExaminadorVet.findBy("user_id", userId)

      if (!examinadorVet?.signature || !examinadorVet?.country || !examinadorVet?.crmv_state || !examinadorVet?.crmv_number) return false
    }

    if (info?.is_examinador_radiologia) {
      const examinadorRad = await UserExaminadorRad.findBy("user_id", userId)

      if (!examinadorRad?.signature || !examinadorRad?.country || !examinadorRad?.crtr_state || !examinadorRad?.crtr_number) return false
    }

    return true
  }

  // public async getUsers({}: HttpContextContract) {
  //   const usuarios = await User.all()
  //   const identificacoes = await UserIdentificacao.all()
  //   const contatos = await UserContato.all()

  //   let listaUsuarios: any[] = []

  //   usuarios.forEach(({ id: idUsuario, name, email }: User) => {
      
  //     const identificacao = identificacoes.find(({ user_id }) => user_id == idUsuario)
  //     const contato = contatos.find(({ user_id }) => user_id == idUsuario)
      
      
  //     const usuario = {
  //       id: idUsuario,
  //       name,
  //       email,
  //       identificacao: identificacao || null,
  //       contato: contato || null
  //     }

  //     listaUsuarios.push(usuario)
  //   })
    
  //   return listaUsuarios
  // }
}