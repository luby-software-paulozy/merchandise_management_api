import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.all()

    const user = await User.query().where('email', email).preload('roles').first()

    try {
      const token = await auth.use('api').attempt(email, password, {
        name: user?.name,
        expiresIn: '30mins',
      })
      return { token, user }
    } catch (error) {
      return response.unauthorized({ message: 'Creditentials are invalid' })
    }
  }
}
