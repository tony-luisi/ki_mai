
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function(table){
    table.increments()
    table.string('username')
    table.string('fullname')
    table.string('email')
    table.string('password_salt')
    table.string('password')
    table.timestamps()
  })

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')

};
