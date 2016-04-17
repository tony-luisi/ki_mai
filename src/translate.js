var socket = require('./socket')
var input = require('./input')
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

function addLookup(word, lookupArray){
  console.log('lookup', lookupArray)
  var wordDiv = createWord(null, word)
  $('#word-list').append(wordDiv)
  var lookupDiv = createLookup(word, lookupArray)
  definitionArray.push({ word: word, definition: lookupDiv})
  console.log(lookupDiv)
  $('#search-pane').append(lookupDiv)
}

function createLookup(lookupWord, lookupArray){
  var definitionDiv = document.createElement('div')
  definitionDiv.className = 'overall-definition animated fadeIn'
  definitionDiv.id = 'lookup-'+lookupWord

  lookupArray.map(function(theWord){
    var singleWordDiv = document.createElement('button')
    singleWordDiv.className = 'single-definition btn btn-default'
    singleWordDiv.addEventListener('click', replaceLookup)

    var word = document.createElement('p')
    word.innerHTML = lookupWord + " > " + theWord.title


    singleWordDiv.setAttribute("from_word", lookupWord)
    singleWordDiv.setAttribute("to_word", theWord.title)

    singleWordDiv.appendChild(word)

    theWord.details.map(function(detail){
      var englishSentence = document.createElement('div')
      englishSentence.innerHTML = detail
      singleWordDiv.appendChild(englishSentence)
    })
    definitionDiv.appendChild(singleWordDiv)
  })
  return definitionDiv
}

function replaceLookup(event){
  console.log(event.currentTarget)
  var newWord = event.currentTarget.getAttribute('to_word')
  var oldWord = event.currentTarget.getAttribute('from_word')
  // //get string
  var chatPhrase = $("#m").val()
  chatPhrase = chatPhrase.replace(oldWord,newWord)
  $("#m").val(chatPhrase)
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
}
function showDef(event){
  var wordToMatch = event.currentTarget.innerText.trim()
  //$('#search-pane').scrollTop(0)
  //var positionDifference = $("#"+wordToMatch).position().top - $('#search-pane').scrollTop()
  //$('#search-pane').scrollTop(positionDifference)
  //$('#search-pane').append(definition)
  //console.log(definitionArray)

  definitionArray.map(function(definition){
    if (definition.word == wordToMatch){
      $('#search-pane').text('')
      $('#search-pane').append(definition.definition)
    }
  })
}

function createWord(wordsObject, theWord){
  var wordDiv = document.createElement('button')
  wordDiv.className = 'word btn btn-default'
  var word = document.createElement('p')
  if (wordsObject)
    var theWord = wordsObject[0].english_search
  word.innerHTML = theWord
  wordDiv.addEventListener('click', showDef)
  wordDiv.appendChild(word)
  return wordDiv
}


module.exports = {
  update: update,
  addLookup: addLookup
}
