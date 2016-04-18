var socket = require('./socket')
var input = require('./input')
var render = require('./render')
var wordsArray = []
var translatedWords = []
var definitionArray = []
var definitionTemplate = require('./definition.jade')
var wordTemplate = require('./word.jade')

function update(message){
  message = message.split(' ')
  message.map(function(word){
    word = word.toLowerCase()
    if (word.endsWith('$') && wordsArray.indexOf(word) === -1) {
      wordsArray.push(word)
      socket.sendTranslate(word, addTranslation)
    }
  })
}

function addTranslation(data, word){
  if (data.length > 0){
    var defTemp = $.parseHTML(definitionTemplate({ word: word, definition: data}))
    var wordTemp = $.parseHTML(wordTemplate({ word: word }))
    $(defTemp).children('button').click(defClick)
    $(wordTemp).click(wordClick)
    $('#search-pane').text('')
    $('#search-pane').append(defTemp)
    $('#word-list').append(wordTemp)
    definitionArray.push(defTemp[0])
  }
}

function wordClick(event){
  var wordLookup = event.currentTarget.id.split('-').pop()
  var correctDefinition = definitionArray.filter(function(define){
    return define.id.split('-').pop() == wordLookup
  })
  $('#search-pane').text('')
  $('#search-pane').append(correctDefinition)
}

function defClick(event){
  // console.log()
  console.log('click', event.currentTarget)
  // var newWord = event.currentTarget.getAttribute('maori_word')
  // var oldWord = event.currentTarget.getAttribute('english_word')
  // //get string
  // var chatPhrase = $("#m").val()
  // chatPhrase = chatPhrase.replace(oldWord+"$",newWord)
  // $('#m').val(chatPhrase)

}
module.exports = {
  update: update
}
