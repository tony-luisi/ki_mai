var socket = io.connect('/');
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
    if(message.slice(-1)=='$'){
      message = message.slice(0,message.length-1)
    }
    callback(data, message)
  })
}

function sendDefinition(message, callback){
  socket.emit('definition', message, function(err, res){
    console.log('received:', res)
    if (err) {
      callback(err)
      return
    }
    callback(null, res)
  })
}

////// message receivers
socket.on('message', function (data) {
  chat.addMessage(data)
})

module.exports = {
  sendMessage: sendMessage,
  sendSpellcheck: sendSpellcheck,
  sendTranslate: sendTranslate,
  sendDefinition: sendDefinition
}
