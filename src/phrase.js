//this module handles the phrase box, which is the box below the input text box (that deals with either spell checking words, or looking up words that are clicked on to be tranlsated)
var wordsArray = []
var spellchecked = []
var socket = require('./socket')
var translate = require('./translate')

//if a word needs to be highlighted, this function will change the class
function renderSpelling(){
  spellchecked.map(function(word){
    if (!word.correct && !$('#word-' + word.word).hasClass()) {
      $('#phrase-' + word.word).removeClass('btn-link').addClass('btn-warning')
    }
  })
}

//checks to see if the word has already been run through the spellchecker, without having to ask the server again, and returns the word
function getSpellchecked(word){
  var spellcheckarray = spellchecked.filter(function(spellObject){
    return (spellObject.word === word)
  })
  return spellcheckarray[0]
}

//checks to see if the word has been run through the spellchecker
function isSpellchecked(word){
  var spellcheckedWord = false
  spellchecked.map(function(spellObject){
    if (spellObject.word === word) {
      spellcheckedWord = true
    }
  })
  return spellcheckedWord
}

//when a word is clicked, send a request to tranlate the word (but only if a definition of the word exists)
function getDef(event){
  var word = event.currentTarget.innerHTML
  socket.sendDefinition(word, function(err, res){
    if (res.length > 0) {
      translate.update(word+'$', res)
    }
    // $.ajax({
    //   method: "POST",
    //   url: "/word",
    //   data: { word: word }
    // })
    // .done(function( msg ) {
    //   //alert( "Data Saved: " + msg );
    // });
  })
}

//renders the words on the phrase box (this maybe needs to be put into a jade template)
function renderPhrase(words){
  $('#phrase-pane').html('')
  words.map(function(word){
    word = filter(word)
    word = word.toLowerCase()
    var wordButton = document.createElement('button')
    wordButton.id = 'phrase-' + word
    wordButton.className = getClass(word)
    wordButton.innerHTML = word
    wordButton.addEventListener('click', getDef)
    wordButton.setAttribute('data-toogle', "tooltip")
    wordButton.setAttribute('title', "HELLO")
    $('#phrase-pane').append(wordButton)
  })
}

//checks to see if a word has been spell checked and returns the appropriate class of how the element should be highlighted
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

//sends a word to be spellchecked through the socket
function checkSpelling(word){
  socket.sendSpellcheck(word, function(data){
    spellchecked.push({ word: word, correct: data })
    renderSpelling()
  })
}

//if the word ends in dollarsign, . or question >> should turn this into regex
function filter(word){
  if (word.slice(-1) == '$' || word.slice(-1) == '.' || word.slice(-1) == '?'){
      word = word.slice(0, word.length - 1)
  }
  return word
}

//clear the phrase pane
function clear(){
  $('#phrase-pane').html('')
}

//when the input box changes, update the phrase box (i.e. a user pressing a key)
function update(message){
  renderSpelling()
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
  clear: clear
}
