var express = require('express');
var router = express.Router();
var english = require('../english')


module.exports = function(io) {
  var app = require('express')
  var router = app.Router()

  router.get('/', function(req, res, next) {
    var username = req.query.username
    username = username.charAt(0).toUpperCase() + username.substring(1)
    console.log(username)
    res.render('index', { title: 'Ki Mai', name: username });
  });

  io.on('connection', function(socket) {
    socket.on('message', function(message){
      console.log('the message is ', message)
      io.emit('message', message)
    })

    socket.on('translate', function(word){
      console.log('need to translate word', word)
      var translatedWord = english.getWord(word.text.substring(0,word.text.length-1))
      socket.emit('translate', translatedWord)
    })

  })

  return router;
}
