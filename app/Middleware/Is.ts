import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class Is {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    const userId = await auth.user?.id
    let isNext = false

    if (userId) {
      const user = await User.query().where('id', userId).preload('roles').first()

      const userJSON = user?.serialize()

      userJSON?.roles.forEach(({ name }) => {
        guards.forEach((nameRoleGuard) => {
          if (name.toLowerCase() === nameRoleGuard.toLowerCase()) {
            isNext = true
          }
        })
      })
    }

    if (isNext) return next()

    return response.forbidden({ message: 'You are not authorized' })
  }
}
