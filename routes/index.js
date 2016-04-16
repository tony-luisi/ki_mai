var express = require('express');
var router = express.Router();
var english = require('../lib/english')
var path = require('path')
var Spellchecker = require("hunspell-spellchecker");
var spellchecker = new Spellchecker();
var fs = require('fs')
var DICT = spellchecker.parse({
    aff: fs.readFileSync(path.join(__dirname,'../lib/spelling/mi_NZ.aff')),
    dic: fs.readFileSync(path.join(__dirname,'../lib/spelling/mi_NZ.dic'))
});
console.log(path.join(__dirname,'../lib/spelling/mi_NZ.aff'))
spellchecker.use(DICT)

module.exports = function(io) {
  var app = require('express')
  var router = app.Router()

  router.get('/', function(req, res, next) {
    var username = req.query.username || 'user'
    username = username.charAt(0).toUpperCase() + username.substring(1)
    console.log(username)
    res.render('index', { title: 'Ki Mai', name: username });
  });

  io.on('connection', function(socket) {
    socket.on('message', function(message){
      console.log('the message is ', message)
      io.emit('message', message)
    })

    socket.on('translate', function(word, callback){
      console.log('need to translate word', word)
      var translatedWord = english.getWord(word.text.substring(0,word.text.length-1))
      callback(translatedWord)
    })

    socket.on('spelling', function(word, callback){
      console.log('need to spell check word', word)
      var isRight = spellchecker.checkExact(word);
      console.log("SPELLED CORRECTLY: ", word, isRight)
      console.log("suggest", spellchecker.suggest(word))
      callback(isRight)
    })

  })

  return router;
}
