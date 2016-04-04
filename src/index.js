var $ = require('jquery')
var socket = io.connect('http://localhost:3000');
var wordArray = []

$('form').submit(function(){
  var message = $('#m').val()
  console.log(message)
  socket.emit('message', { message: message })
  $('#m').val('');
  return false
})

socket.on('message', function (data) {
  console.log('received', data)
  $('#messages').append($('<li>').text(data.message))
})

socket.on('translate', function(data) {
    console.log('received - appending', data)
    data.map(function(element){
      for (phrase in element){
          $('#search-pane').append('<p>'+element[phrase]+'<p>')
      }



    })

})

$('#m').on('keyup', function() {
  var message = $('#m').val()
  message = message.split(' ')
  message.map(function(word){
    if (word.endsWith('$') && wordArray.indexOf(word) === -1) {
      wordArray.push(word)
      console.log(wordArray)
      socket.emit('translate', { text: word })
    }
  })
})
