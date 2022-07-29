import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesCustom from './messagesCustom'

export default class StoreValidator extends MessagesCustom {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  public schema = schema.create({
    name: schema.string({}, [
      rules.regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
      rules.minLength(3),
      rules.maxLength(100),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.minLength(8),
      rules.maxLength(50),
    ]),
    cpf: schema.string({}, [
      rules.unique({ table: 'users', column: 'cpf' }),
      rules.regex(/^\d{3}.\d{3}.\d{3}-\d{2}$/),
    ]),
    zipCode: schema.string({}, [rules.regex(/^[0-9]{5}-[0-9]{3}$/)]),
    password: schema.string({}, [rules.minLength(8), rules.maxLength(50)]),
    state: schema.string({ trim: true }, [rules.maxLength(2)]),
    city: schema.string({ trim: true }, [rules.maxLength(50)]),
    street: schema.string({ trim: true }, [rules.maxLength(50)]),
    number: schema.string.optional({}, [rules.unsigned()]),
    district: schema.string.optional({ trim: true }, [rules.maxLength(250)]),
    complement: schema.string.optional({ trim: true }, [rules.maxLength(250)]),
  })
}
