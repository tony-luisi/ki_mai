var socket = io.connect('http://localhost:3000');
var chat = require('./chat')
/////// message senders

function sendMessage(message){
  socket.emit('message', message)
}





////// message receivers

socket.on('message', function (data) {
  chat.addMessage(data)
})


//when receiving a translated message
socket.on('translate', function(data) {
  if (data.length > 0){
    var definition = createDefinition(data)
    var word = createWord(data)
    $('#search-pane').append(definition)
    $('#word-list').append(word)
    definitionArray.push(definition)
    var element = document.getElementById('search-pane')
    element.scrollTop += 1000
  }
})


module.exports = {
  sendMessage: sendMessage
}
