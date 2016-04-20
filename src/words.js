var request = require('superagent')
var wordlogTemplate = require('./views/wordlog.jade')
var replacelogTemplate = require('./views/replacelog.jade')

request.get('/words/lookupUser', function(err, res){

  var wordsLookedUp = JSON.parse(res.text)
  var wordLogHTML = $.parseHTML(wordlogTemplate({ words: wordsLookedUp }))[0]
  // console.log(wordLogHTML)
  $('#lookup-pane').append(wordLogHTML)


})


request.get('/words/replaceUser', function(err, res){

  var wordsReplaced = JSON.parse(res.text)
  // console.log(wordsReplaced)
  var wordsReplacedHTML = $.parseHTML(replacelogTemplate({ words: wordsReplaced }))[0]
  // console.log(wordsReplacedHTML)
  $('#replace-pane').append(wordsReplacedHTML)


})
