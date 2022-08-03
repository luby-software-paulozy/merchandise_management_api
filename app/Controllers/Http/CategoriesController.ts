import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import StoreValidator from 'App/Validators/Category/StoreValidator'
import UpdateValidator from 'App/Validators/Category/UpdateValidator'

export default class CategoriesController {
  public async index({ response, request }: HttpContextContract) {
    const { perPage, currentPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return Category.query().filter(inputs)
    }

    try {
      const users = await Category.query()
        .filter(inputs)
        .paginate(currentPage || 1, perPage || 10)

      return response.status(200).json(users)
    } catch (error) {
      return response.badRequest({
        message: 'error on list categories',
        originalError: error.message,
      })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    await request.validate(StoreValidator)

    const body = request.only(['name', 'observation'])

    try {
      const categoryCreated = await Category.create(body)

      return response.status(201).json(categoryCreated)
    } catch (error) {
      return response.badRequest({
        message: 'error on create a new category',
        originalError: error.message,
      })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    const categoryId = params.id

    try {
      const category = await Category.findByOrFail('id', categoryId)

      return response.status(200).json(category)
    } catch (error) {
      return response.notFound({ message: 'category not found', originalError: error.message })
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const categoryId = params.id
    const body = request.only(['name', 'obervation'])

    try {
      const categoryUpdated = await Category.findByOrFail('id', categoryId)

      await categoryUpdated.merge(body).save()
    } catch (error) {
      return response.badRequest({
        message: 'error on update a category',
        originalError: error.message,
      })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const categoryId = params.id

    try {
      const category = await Category.findByOrFail('id', categoryId)
      await category.delete()
    } catch (error) {
      return response.notFound({ message: 'category not found', originalError: error.message })
    }

    return response.status(204).json({ message: 'user deleted' })
  }
}
