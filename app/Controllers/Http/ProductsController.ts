import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'
import StoreValidator from 'App/Validators/Product/StoreValidator'
import UpdateValidator from 'App/Validators/Product/UpdateValidator'

export default class ProductsController {
  public async index({ response, request }: HttpContextContract) {
    const { perPage, currentPage, noPaginate, ...inputs } = request.qs()

    if (noPaginate) {
      return Product.query().preload('categories').filter(inputs)
    }

    try {
      const users = await Product.query()
        .preload('categories')
        .filter(inputs)
        .paginate(currentPage || 1, perPage || 10)

      return response.status(200).json(users)
    } catch (error) {
      return response.badRequest({
        message: 'error on list products',
        originalError: error.message,
      })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    await request.validate(StoreValidator)

    const body = request.only(['name', 'code'])
    const { categories } = request.all()

    let productCreated

    const trx = await Database.beginGlobalTransaction()

    try {
      productCreated = await Product.create(body, trx)

      await Promise.all(
        categories.map(async (category) => {
          const hasCategory = await Category.findBy('name', category)
          if (hasCategory) {
            await productCreated.related('categories').attach(hasCategory.id, trx)
          }
        })
      )
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'error on create a new product',
        originalError: error.message,
      })
    }

    let product

    try {
      product = await Product.query()
        .where('id', productCreated.id)
        .preload('categories')
        .firstOrFail()
    } catch (error) {
      return response.badRequest({
        message: 'error on find product',
        originalError: error.message,
      })
    }

    trx.commit()

    return response.status(201).json(product)
  }

  public async show({ response, params }: HttpContextContract) {
    const productSecureId = params.id

    try {
      const product = await Product.query()
        .where('secure_id', productSecureId)
        .preload('categories')
        .firstOrFail()

      return response.status(200).json(product)
    } catch (error) {
      return response.notFound({ message: 'category not found', originalError: error.message })
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    await request.validate(UpdateValidator)

    const productId = params.id
    const body = request.only(['name', 'code'])
    const { categories } = request.all()

    let productUpdated
    const trx = await Database.beginGlobalTransaction()

    try {
      productUpdated = await Product.findByOrFail('secure_id', productId)

      await productUpdated.merge(body).save()

      let categoriesIds: number[] = []

      await Promise.all(
        categories.map(async (category) => {
          const hasCategory = await Category.findBy('name', category)
          if (hasCategory) {
            categoriesIds.push(hasCategory.id)
          }
        })
      )

      await productUpdated.related('categories').sync(categoriesIds, trx)
      await productUpdated.merge(body).save()
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'error on update a category',
        originalError: error.message,
      })
    }

    let product

    try {
      product = await Product.query()
        .where('id', productUpdated.id)
        .preload('categories')
        .firstOrFail()
    } catch (error) {
      trx.rollback()
      return response.badRequest({
        message: 'error on find product',
        originalError: error.message,
      })
    }

    trx.commit()

    return response.status(200).json(product)
  }

  public async destroy({ response, params }: HttpContextContract) {
    const productSecureId = params.id

    try {
      const product = await Product.findByOrFail('secure_id', productSecureId)
      await product.delete()
    } catch (error) {
      return response.notFound({ message: 'product not found', originalError: error.message })
    }

    return response.status(204).json({ message: 'produc deleted' })
  }
}
