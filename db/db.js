
var Knex = require('knex');
var knexConfig = require('../knexfile')

var knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

module.exports =  {
    getUsers: function () {
      return knex.select().table('users')
    }
}
