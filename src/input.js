var socket = require('./socket')
var phrase = require('./phrase')

//when the user enters a message into the chat window
function submitChatMessage(user){
  console.log('here')
  var message = $('#m').val()
  var username = $('#username').text()
  if (message !== '') socket.sendMessage({ from: username, message: message })
  $('#m').val('')
}

function updateMessage(message){
  $('#m').val(message)
}

function getChatMessage(){
  return $('#m').val()
}

module.exports = {
  submitChatMessage: submitChatMessage,
  getChatMessage: getChatMessage,
  updateMessage: updateMessage
}
