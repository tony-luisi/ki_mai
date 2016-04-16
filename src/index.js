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
