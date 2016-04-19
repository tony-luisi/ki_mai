//this module handles all the input and output from a the chat text box that the user types
var phrase = require('./phrase')
var inputID = '#m'


//when the user enters a message into the chat window
function submitChatMessage(user){
  var message = $(inputID).val()
  var username = $('#username').text()
  if (message !== '') socket.sendMessage({ from: username, message: message })
  $(inputID).val('')
}

//update the chat input box when this is called
function updateMessage(message){
  $(inputID).val(message)
}

function getChatMessage(){
  return $(inputID).val()
}

module.exports = {
  submitChatMessage: submitChatMessage,
  getChatMessage: getChatMessage,
  updateMessage: updateMessage
}
