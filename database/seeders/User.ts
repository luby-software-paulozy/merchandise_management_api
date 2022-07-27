import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Role from 'App/Models/Role'

import { v4 as uuid } from 'uuid'

export default class extends BaseSeeder {
  public async run() {
    /* ADMIN SEED  */

    const searchKeyAdmin = { email: 'admin@email.com' }
    const userAdmin = await User.updateOrCreate(searchKeyAdmin, {
      secureId: uuid(),
      name: 'Admin',
      cpf: '000.000.000-00',
      email: 'admin@email.com',
      password: 'secret',
    })
    const roleAdmin = await Role.findBy('name', 'admin')
    if (roleAdmin) await userAdmin.related('roles').attach([roleAdmin.id])

    /* CLIENT SEED  */

    const searchKeyClient = { email: 'client@email.com' }
    const userClient = await User.updateOrCreate(searchKeyClient, {
      secureId: uuid(),
      name: 'Client',
      cpf: '111.111.111-11',
      email: 'client@email.com',
      password: 'secret',
    })
    const roleClient = await Role.findBy('name', 'client')
    if (roleClient) await userClient.related('roles').attach([roleClient.id])

    /* EMPLOYEE SEED  */

    const searchKeyEmployee = { email: 'client@email.com' }
    const userEmployee = await User.updateOrCreate(searchKeyEmployee, {
      secureId: uuid(),
      name: 'Employee',
      cpf: '222.222.222-22',
      email: 'employee@email.com',
      password: 'secret',
    })
    const roleEmployee = await Role.findBy('name', 'employee')
    if (roleEmployee) await userEmployee.related('roles').attach([roleEmployee.id])
  }
}
