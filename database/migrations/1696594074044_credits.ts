import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'credits'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('id').inTable('users')
      table.string('description')
      table.integer('qtd')
      table.float('plan_value', 8, 2)
      table.timestamp('buy_at', { useTz: true })
      table.string('expired_at')
      table.string('status')
      table.string('buy_reference')
      table.string('buy_type')
      table.string('url_boleto')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
