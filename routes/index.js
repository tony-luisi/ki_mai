var express = require('express');
var router = express.Router();
var english = require('../lib/english')
var scraper = require('../lib/scraper')
var path = require('path')
var Spellchecker = require("hunspell-spellchecker");
var spellchecker = new Spellchecker();
var fs = require('fs')
var db = require(path.join(__dirname, '../db/db'));

var DICT = spellchecker.parse({
    aff: fs.readFileSync(path.join(__dirname,'../lib/spelling/mi_NZ.aff')),
    dic: fs.readFileSync(path.join(__dirname,'../lib/spelling/mi_NZ.dic'))
});
spellchecker.use(DICT)

module.exports = function(io) {
  var app = require('express')
  var router = app.Router()

  router.get('/', function(req, res, next) {
    console.log(req.session)

    var username = req.query.username || 'user'
    username = username.charAt(0).toUpperCase() + username.substring(1)
    console.log(username)
    res.render('index', { title: 'Ki Mai', name: username });
  });

  router.post('/word', function(req, res, next) {
    console.log('req', req.body)
    console.log('googleid', req.body.googleid)
    db.getUserIDByGoogleID(req.body.googleid).then(function(result){
      console.log('result', result[0].id)
      db.addWord(req.body.word, result[0].id).then(function(result){
        console.log('result of words', result)
        res.send('success')
      })
    })
  })

  router.get('/ngata', function(req, res, next){
    res.send(english.getWord(req.query.word))

  })

  router.get('/teaka', function(req, res, next){
    scraper.getDefinition(req.query.word, function(err, result){
      res.send(result)
    })

  })

  io.on('connection', function(socket) {
    socket.on('message', function(message){
      console.log('the message is ', message)
      io.emit('message', message)
    })

    socket.on('translate', function(word, callback){
      var wordToTranslate = word.text.substring(0,word.text.length-1)
      var translatedWord = english.getWord(wordToTranslate)

      if (translatedWord.length==0){
        scraper.getDefinition(wordToTranslate, function(err, result){
          callback(result)
        })
      } else {
        callback(translatedWord)
      }

    })

    socket.on('spelling', function(word, callback){
      console.log('need to spell check word', word)
      var isRight = spellchecker.checkExact(word);
      console.log("SPELLED CORRECTLY: ", word, isRight)
      console.log("suggest", spellchecker.suggest(word))
      callback(isRight)
    })

    socket.on('definition', function(word, callback){
      scraper.getDefinition(word, function(err, res){
        if (err) {
          callback(err)
          return
        }
        callback(null, res)
      })

    })

  })

  return router;
}
