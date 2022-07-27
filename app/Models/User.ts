import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import Address from './Address'
import Purchase from './Purchase'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: typeof uuid

  @column()
  public name: string

  @column()
  public cpf: string

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // um usuário pode ter vários endereços
  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  // um usuário pode ter várias compras
  @hasMany(() => Purchase)
  public purchases: HasMany<typeof Purchase>

  @manyToMany(() => Role, {
    pivotTable: 'users_roles',
  })
  public roles: ManyToMany<typeof Role>
}
