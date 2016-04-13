var $ = require('jquery')
var socket = io.connect('http://localhost:3000');
var wordArray = []
var definitionArray = []
var phraseArray = []

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
  checkPhraseSpelling()
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

//when a user types, update the phrse pane
function updatePhrasePane(message){
  //don't proceed if user is in the middle of typing a word
  if (message.slice(-1) != ' ') {
    return
  }

  $('#phrase-pane').html('')

  var phrases = message.split(' ')

  phrases.map(function(word){

    if (word.slice(-1) == '$' || word.slice(-1) == '.' || word.slice(-1) == '?'){
      word = word.slice(0, word.length - 1)
    }

    word = word.toLowerCase()



    var wordButton = document.createElement('button')
    wordButton.id = 'word-' + word
    wordButton.className = 'btn btn-link'
    wordButton.innerHTML = word


    socket.emit('spelling', word, function(data){
      console.log('spellinkg', word, data)
      var newWord = { word: word, correct: data }
      // if (phraseArray.indexOf(newWord) == -1)
      //   phraseArray.push(newWord)
      var checkInArray = phraseArray.filter(function(wordObject){
        return wordObject.word == newWord.word
      })
      console.log('in array?', checkInArray)
      if (checkInArray.length === 0){
        phraseArray.push(newWord)
        checkPhraseSpelling()
      }

    })
    $('#phrase-pane').append(wordButton)
    checkPhraseSpelling()
  })

}

function checkPhraseSpelling(){
  console.log('here', phraseArray)
  phraseArray.map(function(word){
    console.log('check work', word)
    if (!word.correct && !$('#word-' + word.word).hasClass()) {
      $('#word-' + word.word).removeClass('btn-link').addClass('btn-warning')
    }
  })
}

//
function showDef(event){
  var wordToMatch = event.currentTarget.innerText
  console.log(wordToMatch)
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

function replaceWord(event){
  var newWord = event.currentTarget.getAttribute('maori_word')
  var oldWord = event.currentTarget.getAttribute('english_word')
  //get string
  var chatPhrase = $("#m").val()
  chatPhrase = chatPhrase.replace(oldWord+"$",newWord)
  $('#m').val(chatPhrase)
  updatePhrasePane(chatPhrase)
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
