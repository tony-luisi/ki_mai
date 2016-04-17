
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('words', function(table){
    table.increments()
    table.integer('userid')
    table.string('word')
    table.string('definition')
    table.timestamps()
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('words')

};
