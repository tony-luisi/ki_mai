var input = require('./input') //handles input / output of the textbox the user types in
var phrase = require('./phrase') //handles the phrase input / output below the input box
var translate = require('./translate') //handles the translation of words
var spelling = require('./spelling') //handles the spell checking of words in the phrase box -- not used yet

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

//every time a user inputs a keystroke
$('form').submit(function(){
  input.submitChatMessage('user')
  phrase.clear()
  return false
})

//when a user types a key in the chat - and wants a word to be translated
$('#m').on('keyup', function() {
  var message = input.getChatMessage()
  phrase.update(message)
  translate.update(message)
})

//every time a user presses the submit button
$('#sendbutton').click(function(){
  input.submitChatMessage('user')
  phrase.clear()
  return false
})

//every time a person clicks something in the word box
$('#search-pane').click(function(){
  var message = input.getChatMessage()
  phrase.update(message)
})
