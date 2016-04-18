var input = require('./input')
var phrase = require('./phrase')
var translate = require('./translate')
var spelling = require('./spelling')


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


$('#sendbutton').click(function(){
  input.submitChatMessage('user')
  phrase.clear()
  return false
})

$('#search-pane').click(function(){
  var message = input.getChatMessage()
  phrase.update(message)
})
