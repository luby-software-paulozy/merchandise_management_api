import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.ok('List all users')
  }

  public async store({ response }: HttpContextContract) {
    response.ok('Store a new user')
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
