import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public zipCode: string

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public street: string

  @column()
  public district: string

  @column()
  public number: number

  @column()
  public complement: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // um usuário só pode ter um endereço
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
