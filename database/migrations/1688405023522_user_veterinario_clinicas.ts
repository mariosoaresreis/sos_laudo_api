import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_veterinario_clinicas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('veterinario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('user_veterinarios')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string("name")
        .notNullable()
        
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
