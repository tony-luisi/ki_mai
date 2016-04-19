var socket = require('./socket')
var input = require('./input')
var definitionTemplate = require('./definition.jade')
var wordTemplate = require('./word.jade')

var wordsArray = [] //words that have been sent for translation
var translatedWords = [] //words that have been translated, and the definitions
var definitionArray = [] //DOM elements that hold the definitions of words translated

//when a word needs to be translated (probably should call this something else)
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

//adds a translation to the DOM
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

//when a word is clicked on, render the definition for that word
function wordClick(event){
  var wordLookup = event.currentTarget.id.split('-').pop()
  var correctDefinition = definitionArray.filter(function(define){
    return define.id.split('-').pop() == wordLookup
  })
  $('#search-pane').text('')
  $('#search-pane').append(correctDefinition)
  $(correctDefinition).children('button').click(defClick)
}

//when the definition is clicked on, replace the word in the input box with the correct word
function defClick(event){
  var wordToMatch = event.currentTarget.getAttribute("from")
  var wordToReplace = event.currentTarget.getAttribute("to")

  var inputString = $('#m').val()
  console.log('click', event.currentTarget)
  var words = inputString.split(" ")
  var result = words.map(function(word){
    if (word == wordToMatch){
      return wordToReplace
    } else if (word == wordToMatch+'$') {
      return wordToReplace
    } else {
      return word
    }
  }).join(" ")
  $('#m').val(result)
}


module.exports = {
  update: update
}
