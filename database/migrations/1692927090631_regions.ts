import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'regions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.integer('image_count')
      table.integer('price')
      table.string('description')
      table.text('display_image')
      table.string('emergency_description')
      table.string('urgency_description')
      table.boolean('has_direction')
      table.integer('price_increase')
      table.integer('group_id').references('id').inTable('groups')
      table.json('section_list')
      table.json('img_section_list')

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
