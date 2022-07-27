import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: string

  @column()
  public categoryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Category, {
    pivotTable: 'products_categories',
  })
  public categories: ManyToMany<typeof Category>
}
