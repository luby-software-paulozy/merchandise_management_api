import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run() {
    const uniqueKey = 'name'

    await Role.updateOrCreateMany(uniqueKey, [
      {
        name: 'admin',
        description: 'Access to all resources',
      },
      {
        name: 'client',
        description: 'Access to shpping and products resources',
      },
      {
        name: 'employee',
        description: 'Access to sales resources',
      },
    ])
  }
}
