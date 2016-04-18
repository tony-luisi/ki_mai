var input = require('./input')
var phrase = require('./phrase')
var translate = require('./translate')
var spelling = require('./spelling')

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
