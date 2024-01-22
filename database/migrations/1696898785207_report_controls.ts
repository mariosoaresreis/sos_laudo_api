import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'report_controls'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('specie_id')
      table.string('specie_name')
      table.integer('pet_id')
      table.integer('region_id')
      table.string('history')
      table.string('suspicion')
      table.string('clinic')
      table.string('exam_name')
      table.float('exam_price', 8,2)
      table.text('exam_image')
      table.string('plantao')
      table.string('urgent')
      table.string('status')
      table.integer('reference_report')
      table.integer('user_id')
      table.integer('veterinary_id')
      table.integer('exam_reference')
      table.integer('exam_old')
      table.boolean('report_exist')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
