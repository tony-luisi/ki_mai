var socket = io.connect('http://localhost:3000');
var chat = require('./chat')
/////// message senders

function sendMessage(message){
  socket.emit('message', message)
}

function sendSpellcheck(message, callback){
  socket.emit('spelling', message, function(data){
    callback(data)
  })
}

function sendTranslate(message, callback){
  socket.emit('translate', { text: message }, function(data){
    callback(data)
  })
}

////// message receivers

socket.on('message', function (data) {
  chat.addMessage(data)
})


// //when receiving a translated message
// socket.on('translate', function(data) {
//   translate.addTranslation(data)
// })


module.exports = {
  sendMessage: sendMessage,
  sendSpellcheck: sendSpellcheck,
  sendTranslate: sendTranslate
}
