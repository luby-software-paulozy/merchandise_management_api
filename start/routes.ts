/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.where('id', Route.matchers.number())

Route.get('db', async ({ response }: HttpContextContract) => {
  await Database.report().then(({ health }) => {
    const { healthy, message } = health

    if (healthy) {
      return response.ok({ message })
    }

    return response.internalServerError({ message })
  })
})

Route.group(() => {
  Route.resource('users', 'UsersController').apiOnly()
  Route.post('login', 'AuthController.login')
}).prefix('v1/api')

/* Authenticated Routes */

Route.group(() => {
  Route.get('test', ({ response }) => {
    return response.ok('auhtenticade')
  })
})
  .prefix('v1/api')
  .middleware(['auth', 'is:admin,client'])
