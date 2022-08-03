/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class UserFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof User, User>

  // public method(value: any): void {
  //   this.$query.where('name', value)
  // }

  name(value: string) {
    this.$query.where('name', 'LIKE', `%${value}%`)
  }

  createdAt(value: string) {
    this.$query.where('create_at', 'LIKE', `%${value}%`)
  }

  city(value: string) {
    this.$query.whereHas('addresses', (addresses) => addresses.where('city', 'LIKE', `%${value}%`))
  }

  state(value: string) {
    this.$query.whereHas('addresses', (addresses) => addresses.where('state', 'LIKE', `%${value}%`))
  }
}
