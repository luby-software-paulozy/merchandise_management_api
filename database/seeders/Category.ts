import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const uniqueKey = 'name'

    await Category.updateOrCreateMany(uniqueKey, [
      {
        name: 'Açougue',
        observation: 'Carnes em geral',
      },
      {
        name: 'Limpeza',
        observation: 'produtos de limpeza em geral',
      },
      {
        name: 'Higiene',
        observation: 'produtos de higiene em geral',
      },
      {
        name: 'Hortifruti',
        observation: 'Frutas e verduras em geral',
      },
      {
        name: 'Utilidades',
        observation: 'Produtos de utilidade em geral',
      },
    ])
  }
}
