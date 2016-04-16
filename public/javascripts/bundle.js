(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function addMessage(messageObject){
  $('#messages').append($('<li class="animated fadeInUp">').text(messageObject.from + ": " + messageObject.message))
  $('#message-pane').scrollTop($('#message-pane').scrollTop() + 100)
}


module.exports = {
  addMessage: addMessage
}

},{}],2:[function(require,module,exports){
var input = require('./input')
var phrase = require('./phrase')
var translate = require('./translate')

$('form').submit(function(){
  input.submitChatMessage()
  phrase.clear()
  return false
})

//when a user types a key in the chat - and wants a word to be translated
$('#m').on('keyup', function() {
  var message = input.getChatMessage()
  phrase.update(message)
  translate.update(message)
})

//

},{"./input":3,"./phrase":4,"./translate":6}],3:[function(require,module,exports){
var socket = require('./socket')

//when the user enters a message into the chat window
function submitChatMessage(){
  console.log('here')
  var message = $('#m').val()
  var username = $('#username').text()
  if (message !== '') socket.sendMessage({ from: username, message: message })
  $('#m').val('')
}

function getChatMessage(){
  return $('#m').val()
}

module.exports = {
  submitChatMessage: submitChatMessage,
  getChatMessage: getChatMessage
}

},{"./socket":5}],4:[function(require,module,exports){
var wordsArray = []
var spellchecked = []
//var symbol_lookup = ['$', '.', '?', ',']
var socket = require('./socket')

function renderSpelling(){
  spellchecked.map(function(word){
    if (!word.correct && !$('#word-' + word.word).hasClass()) {
      $('#word-' + word.word).removeClass('btn-link').addClass('btn-warning')
    }
  })
}

function getSpellchecked(word){
  var spellcheckarray = spellchecked.filter(function(spellObject){
    return (spellObject.word === word)
  })
  return spellcheckarray[0]
}

function isSpellchecked(word){
  var spellcheckedWord = false
  spellchecked.map(function(spellObject){
    if (spellObject.word === word) {
      spellcheckedWord = true
    }
  })
  return spellcheckedWord
}

function renderPhrase(words){
  $('#phrase-pane').html('')
  words.map(function(word){
    word = filter(word)
    word = word.toLowerCase()
    var wordButton = document.createElement('button')
    wordButton.id = 'word-' + word
    wordButton.className = getClass(word)
    wordButton.innerHTML = word
    $('#phrase-pane').append(wordButton)
  })
}

function getClass(word) {
  if (isSpellchecked(word)){
    var wordObject = getSpellchecked(word)
    if (wordObject.correct){
      return 'btn btn-link'
    } else {
       return 'btn btn-warning'
    }
  } else {
    return 'btn btn-link'
  }
}

function checkSpelling(word){
  socket.sendSpellcheck(word, function(data){
    spellchecked.push({ word: word, correct: data })
    renderSpelling()
  })
}

function filter(word){
  if (word.slice(-1) == '$' || word.slice(-1) == '.' || word.slice(-1) == '?'){
      word = word.slice(0, word.length - 1)
  }
  return word
}

function clear(){
  $('#phrase-pane').html('')
}

function update(message){
  renderSpelling()
  // if (message.slice(-1) != ' ') {
  //   return
  // }
  var words = message.split(' ')
  renderPhrase(words)
  var newWords = words.filter(function(word){
    return wordsArray.indexOf(word) === -1
  })
  newWords.map(function(word){
    word = filter(word)
    wordsArray.push(word)
    checkSpelling(word)
  })
}

module.exports = {
  checkSpelling: checkSpelling,
  update: update,
  clear: clear//,
  //renderSpelling: renderSpelling
}

},{"./socket":5}],5:[function(require,module,exports){
var socket = io.connect('http://localhost:3000');
var chat = require('./chat')
/////// message senders

function sendMessage(message){
  socket.emit('message', message)
}

function sendSpellcheck(message, callback){
  socket.emit('spelling', message, function(data){
    callback(data)
  })
}

function sendTranslate(message, callback){
  socket.emit('translate', { text: message }, function(data){
    callback(data)
  })
}

////// message receivers

socket.on('message', function (data) {
  chat.addMessage(data)
})


// //when receiving a translated message
// socket.on('translate', function(data) {
//   translate.addTranslation(data)
// })


module.exports = {
  sendMessage: sendMessage,
  sendSpellcheck: sendSpellcheck,
  sendTranslate: sendTranslate
}

},{"./chat":1}],6:[function(require,module,exports){
var socket = require('./socket')
var phrase = require('./phrase')
var wordsArray = []
var translatedWords = []
var definitionArray = []

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

function addTranslation(data){
  console.log('data', data)
  if (data.length > 0){
    var definition = createDefinition(data)
    var word = createWord(data)
    $('#search-pane').append(definition)
    $('#word-list').append(word)
    definitionArray.push(definition)
    var element = document.getElementById('search-pane')
    element.scrollTop += 1000
  }
}

//creating an element for the translation and returning it
function createDefinition(wordsObject){
  //outside tag
  var definitionDiv = document.createElement('div')
  definitionDiv.className = 'overall-definition animated fadeIn'
  definitionDiv.id = wordsObject[0].english_search

  wordsObject.map(function(theWord){
    var singleWordDiv = document.createElement('button')
    singleWordDiv.className = 'single-definition btn btn-default'
    singleWordDiv.addEventListener('click', replaceWord)
    var word = document.createElement('p')
    word.innerHTML = theWord.english_search + " > " + theWord.maori_search
    singleWordDiv.setAttribute("maori_word", theWord.maori_search.split(",")[0].trim())
    singleWordDiv.setAttribute("english_word", theWord.english_search.split(",")[0].trim())
    singleWordDiv.appendChild(word)
    var englishSentence = document.createElement('p')
    englishSentence.innerHTML = theWord.english_sentence
    singleWordDiv.appendChild(englishSentence)
    var maoriSentence = document.createElement('p')
    maoriSentence.innerHTML = theWord.maori_sentence
    singleWordDiv.appendChild(maoriSentence)
    definitionDiv.appendChild(singleWordDiv)
  })
  return definitionDiv
}

function replaceWord(event){
  var newWord = event.currentTarget.getAttribute('maori_word')
  var oldWord = event.currentTarget.getAttribute('english_word')
  //get string
  var chatPhrase = $("#m").val()
  chatPhrase = chatPhrase.replace(oldWord+"$",newWord)
  $('#m').val(chatPhrase)
  phrase.update($('#m').val())
}
function showDef(event){
  var wordToMatch = event.currentTarget.innerText
  $('#search-pane').scrollTop(0)
  var positionDifference = $("#"+wordToMatch).position().top - $('#search-pane').scrollTop()
  $('#search-pane').scrollTop(positionDifference)
}

function createWord(wordsObject){
  var wordDiv = document.createElement('button')
  wordDiv.className = 'word btn btn-default'
  var word = document.createElement('p')
  var theWord = wordsObject[0].english_search
  word.innerHTML = theWord
  wordDiv.addEventListener('click', showDef)
  wordDiv.appendChild(word)
  return wordDiv
}


module.exports = {
  update: update
}

},{"./phrase":4,"./socket":5}]},{},[2]);
