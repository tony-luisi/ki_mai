var $ = require('jquery')
var socket = io.connect('http://localhost:3000');

$('form').submit(function(){
  var message = $('#m').val()
  console.log(message)
  socket.emit('message', { message: message })
  $('#m').val('');
  return false
})

socket.on('message', function (data) {
  console.log('received', data);
  $('#messages').append($('<li>').text(data.message))
})

$('#m').on('keyup', function() {
  var message = $('#m').val()
  console.log(message)
})
