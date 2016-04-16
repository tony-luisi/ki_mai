var wordsArray = []
var spellchecked = []
//var symbol_lookup = ['$', '.', '?', ',']
var socket = require('./socket')
var translate = require('./translate')

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

function getDef(event){
  var word = event.currentTarget.innerHTML
  console.log('sending', word)
  // translate.update(word + "$")
  socket.sendDefinition(word, function(err, res){
    if (res.length > 0) {
      translate.addLookup(word, res)
    }
  })
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
    wordButton.addEventListener('click', getDef)
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
