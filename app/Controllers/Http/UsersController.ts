import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    response.status(200).json({ message: 'success' })
  }

  public async store({ response, request }: HttpContextContract) {
    const body = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'zipCode',
      'street',
      'number',
      'complement',
      'city',
      'state',
      'district',
    ])

    let userCreated

    const trx = await Database.beginGlobalTransaction()

    try {
      userCreated = await User.create(body, trx)
      const role = await Role.findByOrFail('name', 'client')
      await userCreated.related('roles').attach([role.id], trx)
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'error on create a new user', originalError: error })
    }

    try {
      await userCreated.related('addresses').create(bodyAddress)
    } catch (error) {
      return response.badRequest({
        message: 'error on create a new user addresses',
        originalError: error,
      })
    }

    try {
      const user = await User.query()
        .where('id', userCreated.id)
        .preload('roles')
        .preload('addresses')

      return response.status(201).json(user)
    } catch (error) {
      trx.commit()
      return response.badRequest({
        message: 'error on find user',
        originalError: error,
      })
    }
  }

  public async show({ response }: HttpContextContract) {
    response.ok('Show a user')
  }

  public async update({ response, request, params }: HttpContextContract) {
    const body = request.only(['name', 'cpf', 'email', 'password'])
    const bodyAddress = request.only([
      'addressId',
      'zipCode',
      'street',
      'number',
      'complement',
      'city',
      'state',
      'district',
    ])

    let userUpdated

    const trx = await Database.beginGlobalTransaction()

    try {
      userUpdated = await User.findByOrFail('secure_id', params.id)
      userUpdated.useTransaction(trx)

      await userUpdated.merge(body).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({ message: 'error on update an user', originalError: error })
    }

    try {
      const addresses = await Address.findByOrFail('id', bodyAddress.addressId)

      console.log(addresses)

      addresses.useTransaction(trx)
      delete bodyAddress.addressId

      addresses.merge(bodyAddress).save
    } catch (error) {
      return response.badRequest({
        message: 'error on update user addresses',
        originalError: error,
      })
    }

    try {
      const user = await User.query()
        .where('id', userUpdated.id)
        .preload('roles')
        .preload('addresses')

      return response.status(201).json(user)
    } catch (error) {
      trx.commit()
      return response.badRequest({
        message: 'error on find user',
        originalError: error,
      })
    }
  }

  public async destroy({ response }: HttpContextContract) {
    response.ok('Delete a user')
  }
}
