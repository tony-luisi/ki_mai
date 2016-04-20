var Knex = require('knex');
var knexConfig = require('../knexfile')

var knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

module.exports =  {
    getUsers: function () {
      return knex.select().table('users')
    },

    getLookupWords(){
      return knex('lookup_words')
    },

    getReplaceWords(){
      return knex('replace_words')
    },

    getLookupWordsByUser(user){
      return knex('lookup_words').where(user)
    },

    getReplaceWordsByUser(user){
      return knex('replace_words').where(user)
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

    addLookupWord: function(word){
      return knex('lookup_words').insert(word)
    },

    addReplaceWord: function(word){
      var newWord = { from_word: 'from', to_word: 'to', definition: 'definition', userid: 1}
      return knex('replace_words').insert(word)
    },

    findOrCreate: function(user, cb){
      knex('users').where(user)
        .then(function(result){
          if (result.length > 0) {
            cb(result[0])
          } else {
            knex('users').insert(user).then(function(result){
              knex('users').where(user).then(function(resultUser){ cb(resultUser[0])})
            })
          }
        })
    }
}
