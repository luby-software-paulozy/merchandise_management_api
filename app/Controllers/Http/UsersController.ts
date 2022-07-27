import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.status(200).json({ message: 'success' })
  }

  public async store({ response, request }: HttpContextContract) {
    const body = request.only(['name', 'email'])
    response.ok(body)
  }

  public async show({ response }: HttpContextContract) {
    response.ok('Show a user')
  }

  public async update({ response }: HttpContextContract) {
    response.ok('Update a user')
  }

  public async destroy({ response }: HttpContextContract) {
    response.ok('Delete a user')
  }
}
