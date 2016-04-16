var socket = require('./socket')

//when the user enters a message into the chat window
function submitChatMessage(){
  console.log('here')
  var message = $('#m').val()
  var username = $('#username').text()
  if (message !== '') socket.sendMessage({ from: username, message: message })
  $('#m').val('')
}

function getChatMessage(){
  return $('#m').val()
}

module.exports = {
  submitChatMessage: submitChatMessage,
  getChatMessage: getChatMessage
}
