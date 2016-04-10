var $ = require('jquery')
var socket = io.connect('http://localhost:3000');
var wordArray = []
var definitionArray = []

//when the user enters a message into the chat window
$('form').submit(function(){
  var user = $('#username').text()
  var message = user + ": " + $('#m').val()
  if (message !== '') {
    socket.emit('message', { message: message })
  }
  $('#m').val('');
  return false
})

//when a user receives a chat message into the chat window
socket.on('message', function (data) {
  $('#messages').append($('<li class="animated fadeInUp">').text(data.message))
  var element = document.getElementById('message-pane')
  element.scrollTop += 100
})

//when receiving a translated message
socket.on('translate', function(data) {
    if (data.length > 0){
    var definition = createDefinition(data)
    var word = createWord(data)
    $('#search-pane').append(definition)
    $('#word-list').append(word)
    definitionArray.push(definition)
    var element = document.getElementById('search-pane')
    element.scrollTop += 1000
  }
})

//when a user types a key in the chat - and wants a word to be translated
$('#m').on('keyup', function() {
  var message = $('#m').val()
  updatePhrasePane(message)
  message = message.split(' ')
  message.map(function(word){
    word = word.toLowerCase()
    if (word.endsWith('$') && wordArray.indexOf(word) === -1) {
      wordArray.push(word)
      socket.emit('translate', { text: word })
    }
  })
})

function updatePhrasePane(message){
  $('#phrase-pane').text(message)
  var phrase = $('#phrase-pane').text().split(' ')
  var parsedPhrase = phrase.map(function(word){
    return word.replace(/[^\w\s]/gi, '')

  })
  console.log('phrase', phrase)
  console.log('parsed', parsedPhrase)
  if (parsedPhrase.length > 0)
    socket.emit('spelling', phrase[0])
}

function showDef(event){
  var wordToMatch = event.target.innerText
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
  wordDiv.onclick = showDef
  wordDiv.appendChild(word)
  return wordDiv
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
    var word = document.createElement('p')
    word.innerHTML = theWord.english_search + " > " + theWord.maori_search
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
