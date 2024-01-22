import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {

    public async login({ auth, request, response }: HttpContextContract) {

        const { email, password } = request.only(['email', 'password']);

        try {

            const token = await auth.use('api')
                .attempt(email, password)
            
            const user = await User.query()
                .where('email', email)

            return response.status(200).json({ 
                user: user[0],
                token: token.token
            })

        } catch {
            return response.status(200).json({ 
                message: 'Invalid credentials'
            })
        }

    }

    public async validateToken({ auth, response }: HttpContextContract) {

        try{
            
            await auth.use('api').authenticate()
            const isValid = await auth.use('api').isLoggedIn

            if (isValid){
                const id = auth?.user?.id
                const user = await User.find(id)
                return response.status(200).json({ 
                    isValid: isValid,
                    user: user
                })
            }

            return response.status(200).json({ 
                isValid: isValid
            })

        }catch(error) {

            return response.status(200).json({ 
                isValid: false
            })

        }

    }

    public async logout({ auth, response }: HttpContextContract) {

        await auth.use('api').revoke()

        return response.status(200).json({ 
            revoked: true
        })

    }

}