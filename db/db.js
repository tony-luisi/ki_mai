var Knex = require('knex');
var knexConfig = require('../knexfile')

var knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

module.exports =  {
    getUsers: function () {
      return knex.select().table('users')
    },

    addWord: function(word, id) {
      console.log('need to add', word, 'id', id)
      return knex('words').insert({ word: word, userid: id })
    },

    getUserIDByGoogleID: function(googleid) {
      return knex('users').where({ google_id: googleid })
    },

    getUser: function(user){
      return knex('users').where(user)
    },

    allWords: function(){
      return knex('words')
    },

    addUser: function(user){
      return knex('users').insert(user)
    },

    findOrCreate: function(user){
      knex('users').where(user)
        .then(function(result){
          if (result.length > 0) {
            console.log('already exists')
            return result
          } else {
            console.log('doesnt exist - creating')
            return knex('users').insert(user)
          }
        })
    }
}
